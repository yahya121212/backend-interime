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
  ) {}
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

  async findAll() {
    return this.locationRepository.find();
  }

}
