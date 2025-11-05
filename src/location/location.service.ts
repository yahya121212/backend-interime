import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { PostalCodeService } from 'src/postal-code/postal-code.service';
import { CityService } from 'src/city/city.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly zipCodeService: PostalCodeService,
    private readonly cityService: CityService,
  ) { }
  async findOrCreate(locationData: CreateLocationDto): Promise<Location> {
    const { postalCode, city, address, addressLine2 } = locationData;

    const zipCode = await this.zipCodeService.findOneByCode(postalCode);

    const cityEntity = await this.cityService.findOneByName(city);

    let location = await this.locationRepository.findOne({
      where: { address: address, postalCode: zipCode },
    });

    if (!location) {
      location = this.locationRepository.create({
        postalCode: zipCode,
        city: cityEntity,
        address: address,
        addressLine2: addressLine2,
      });
      await this.locationRepository.save(location);
    }

    return location;
  }
  async findOrCreate2(locationData: CreateLocationDto): Promise<Location> {
    const { postalCode, city, address, addressLine2 } = locationData;

    // Récupérer les entités liées
    const zipCodeEntity = await this.zipCodeService.findOneByCode(postalCode);
    const cityEntity = await this.cityService.findOneByName(city);

    // Trouver une location existante avec même adresse, code postal et ville
    let location = await this.locationRepository.findOne({
      where: {
        address,
        postalCode: { id: zipCodeEntity.id },
        city: { id: cityEntity.id },
      },
      relations: ['postalCode', 'city'],
    });

    // Si existe → mettre à jour (si champs changent)
    if (location) {
      location.addressLine2 = addressLine2 ?? location.addressLine2;

      return await this.locationRepository.save(location);
    }

    // Sinon → créer nouvelle location
    location = this.locationRepository.create({
      address,
      addressLine2,
      postalCode: zipCodeEntity,
      city: cityEntity,
    });

    return await this.locationRepository.save(location);
  }

  async findAll() {
    return this.locationRepository.find();
  }

}
