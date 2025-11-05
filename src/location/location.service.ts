import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { PostalCodeService } from 'src/postal-code/postal-code.service';
import { CityService } from 'src/city/city.service';
import { Region } from 'src/region/entities/region.entity';
import { Department } from 'src/department/entities/department.entity';
import { City } from 'src/city/entities/city.entity';

@Injectable()
export class LocationService {

  constructor(
    @InjectRepository(Location)
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,

    private readonly zipCodeService: PostalCodeService,
    private readonly cityService: CityService,

    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
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
  async createFullCityHierarchy(regionName: string, departmentName: string, cityName: string): Promise<City> {
    // Créer la région
    const region = this.regionRepository.create({ name: regionName });
    await this.regionRepository.save(region);

    // Créer le département lié à la région
    const department = this.departmentRepository.create({
      name: departmentName,
      region: region,
    });
    await this.departmentRepository.save(department);

    // Créer la ville liée au département
    const city = this.cityRepository.create({
      name: cityName,
      department: department,
    });
    await this.cityRepository.save(city);

    return city;
  }
  async findOrCreate2(locationData: any): Promise<Location> {
    const cityEntity = await this.createFullCityHierarchy(
      locationData.region,
      locationData.department,
      locationData.city
    );

    const newLocation = this.locationRepository.create({
      city: cityEntity,
    });
    return await this.locationRepository.save(newLocation);
  }



  async findAll() {
    return this.locationRepository.find();
  }

}
