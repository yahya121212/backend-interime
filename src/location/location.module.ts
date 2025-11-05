import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from './entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostalCodeModule } from 'src/postal-code/postal-code.module';
import { CityModule } from 'src/city/city.module';
import { Region } from 'src/region/entities/region.entity';
import { Department } from 'src/department/entities/department.entity';
import { City } from 'src/city/entities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location,     // ✅ repository pour Location
      Region,       // ✅ repository pour Region
      Department,   // ✅ repository pour Department
      City,         // ✅ repository pour City
    ]),
    PostalCodeModule, // ✅ pour PostalCodeService
    CityModule,       // ✅ pour CityService
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [
    LocationService,           // ✅ permet l’utilisation dans CandidateModule
    TypeOrmModule,             // ✅ rend les repositories accessibles aux modules importateurs
  ],
})
export class LocationModule {}