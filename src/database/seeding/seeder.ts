import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { SeedStatus } from './seed-status.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { StatusService } from 'src/status/status.service';
import { RegionService } from 'src/region/region.service';
import { PostalCodeService } from 'src/postal-code/postal-code.service';
import { DepartmentService } from 'src/department/department.service';
import { CityService } from 'src/city/city.service';
import { JobService } from 'src/job/job.service';
import { CountryService } from 'src/country/country.service';
import { ActivityService } from 'src/activity/activity.service';
import { SubActivityService } from 'src/sub-activity/sub-activity.service';
import { PersonService } from 'src/person/person.service';
import { ContractTypeService } from 'src/contract-type/contract-type.service';
import { SkillService } from 'src/skill/skill.service';
import { LanguageService } from 'src/language/language.service';

@Injectable()
export class SeederService implements OnModuleInit {
  logger = new Logger();
  constructor(
    @InjectRepository(SeedStatus)
    private readonly seedStatusRepository: Repository<SeedStatus>,
    private readonly activityService: ActivityService,
    private readonly subActivityService: SubActivityService,
    private readonly cityService: CityService,
    private readonly regionService: RegionService,
    private readonly countryService: CountryService,
    private readonly jobService: JobService,
    private readonly departmentService: DepartmentService,
    private readonly statusService: StatusService,
    private readonly zipCodeService: PostalCodeService,
    private readonly userService: PersonService,
    private readonly contractTypeService: ContractTypeService,
    private readonly skillService: SkillService,
    private readonly languageService: LanguageService,
  ) {}

  async onModuleInit() {
    const seedStatus = await this.seedStatusRepository.findOne({
      where: { isSeeded: true },
    });

    if (!seedStatus) {
      await this.seedAccountStatuses();
      await this.seedActivities();
      await this.seedSubActivities();
      await this.seedJobs();
      await this.seedSkills();
      await this.seedLanguages();
      await this.seedDefaultUsers();
      await this.seedFranceLocations();
      await this.seedContractTypes();
      await this.seedStatusRepository.save({ isSeeded: true });
    }
  }

  private async seedFranceLocations() {
    this.logger.log(
      'Base de données : Population des pays, villes, régions, départements, codes postaux . . .',
    );
    // seed France regions
    const regionsPath = './src/database/data/loc.json';

    const jsonData = await fs.promises.readFile(regionsPath, 'utf-8');
    let countryEntity = await this.countryService.findOneByName('France');
    if (!countryEntity) {
      countryEntity = await this.countryService.create('France');
    }

    const data = JSON.parse(jsonData);
    for (const item of data) {
      // Find or create region
      let regionEntity = await this.regionService.findOneByName(item.region);

      if (!regionEntity) {
        regionEntity = await this.regionService.create({
          name: item.region,
          country: countryEntity,
        });
      }

      // Find or create department
      let department = await this.departmentService.findOneByName(
        item.departement,
      );
      if (!department) {
        department = await this.departmentService.create({
          name: item.departement,
          region: regionEntity,
        });
      }

      // Find or create city
      let cityEntity = await this.cityService.findOneByName(item.commune);
      if (!cityEntity) {
        cityEntity = await this.cityService.create({
          name: item.commune,
          department: department,
        });
      }

      // Find or create postal code and associate with city
      let postalCodeEntity = await this.zipCodeService.findOneByCode(
        item.postalCode,
      );
      if (!postalCodeEntity) {
        // If postal code doesn't exist, create it with the city association
        postalCodeEntity = await this.zipCodeService.create({
          code: item.postalCode,
          cities: [cityEntity],
        });
      } else if (
        !postalCodeEntity.cities.some((city) => city.id === cityEntity.id)
      ) {
        // If postal code exists, ensure city association is added
        postalCodeEntity.cities.push(cityEntity);
      }
      await this.zipCodeService.save(postalCodeEntity);
    }

    this.logger.log(
      'Base de données : Population des pays, villes, régions, départements, codes postaux terminée avec succès',
    );
  }

  private async seedActivities() {
    // Seed des activités
    const activities = [
      { name: 'Agriculture' },
      { name: 'BTP' },
      { name: 'Finance' },
      { name: 'Industrie' },
      { name: 'Services' },
      { name: 'Transport-Logistique' },
    ];

    // Création des entités Activity si elles n'existent pas
    for (const activity of activities) {
      let activityEntity = await this.activityService.findOneByName(
        activity.name,
      );
      if (!activityEntity) {
        activityEntity = await this.activityService.create({
          name: activity.name,
        });
      }
    }
  }

  private async seedSubActivities() {
    // Seed des sous-activités en relation avec les activités
    const subActivitiesPath = './src/database/data/sub-activities.json';
    const stringJson = await fs.promises.readFile(subActivitiesPath, 'utf-8');
    const subActivitiesData = JSON.parse(stringJson);

    for (const item of subActivitiesData) {
      // Vérifiez si la sous-activité existe déjà
      let subActivityEntity = await this.subActivityService.findOneByName(
        item.name,
      );

      // Si la sous-activité n'existe pas, la créer avec la bonne relation Activity
      if (!subActivityEntity) {
        const activityEntity = await this.activityService.findOneByName(
          item.activityName,
        );

        if (activityEntity) {
          subActivityEntity = await this.subActivityService.create({
            name: item.name,
            activity: activityEntity, // Lier la sous-activité à l'activité
          });
        }
      }
    }

    this.logger.log(
      'Base de données : Population des activités et sous-activités terminée avec succès.',
    );
  }

  private async seedJobs() {
    // Seed des métiers (Jobs)
    const jobsPath = './src/database/data/jobs.json';
    const stringObj = await fs.promises.readFile(jobsPath, 'utf-8');
    const jobsData = JSON.parse(stringObj);

    for (const item of jobsData) {
      // Création des entités Job si elles n'existent pas
      let jobEntity = await this.jobService.findOneByName(item.job);

      if (!jobEntity) {
        jobEntity = await this.jobService.create(item.job);
      }
    }

    // Liaison des métiers (Jobs) aux sous-activités (SubActivity)
    for (const job of jobsData) {
      const subAct = await this.subActivityService.findOneByName(
        job.subActivite,
      );
      const jobClass = await this.jobService.findOneByName(job.job);

      if (subAct && jobClass) {
        jobClass.subActivity = subAct; // Lier le job à la sous-activité
        await this.jobService.save(jobClass); // Enregistrer la relation
      }
    }

    this.logger.log(
      'Base de données : Population des métiers terminée avec succès.',
    );
  }

  private async seedAccountStatuses() {
    const statusesPath = './src/database/data/statuses.json';

    // Lecture du fichier JSON contenant les statuts
    const statusesJson = await fs.promises.readFile(statusesPath, 'utf-8');
    const statusesData = JSON.parse(statusesJson);

    for (const status of statusesData) {
      let statusEntity = await this.statusService.findStatus(
        status.name,
        status.context,
      );

      if (!statusEntity) {
        await this.statusService.create({
          name: status.name,
          description: status.description,
          context: status.context,
        });
      }
    }

    this.logger.log(
      'Base de données : Population des statuts terminée avec succès.',
    );
  }

  async seedDefaultUsers() {
    const activeStatus = await this.statusService.findStatus('Active', 'User');

    const existingAdmin = await this.userService.findOneByEmail(
      'recrutement@interim-online.fr',
    );

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('  ', 10);
      const admin = await this.userService.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'recrutement@interim-online.fr',
        password: hashedPassword,
        phone: '+33 1 40 34 10 45',
        birthDate: new Date('1985-05-15'),
        role: Role.ADMIN,
        status: activeStatus,
        emailVerifiedAt: new Date(),
      });
      await this.userService.save(admin);
    }
  }

  private async seedContractTypes() {
    const contractTypeData = [
      { description: 'CDI', isRenewable: false },
      { description: 'CDD', isRenewable: true },
      { description: 'Intérim', isRenewable: true },
      { description: 'Freelance', isRenewable: false },
    ];

    for (const data of contractTypeData) {
      const contractType = await this.contractTypeService.create(data);
      await this.contractTypeService.save(contractType);
    }
    this.logger.log(
      'Base de données : Les types de contrat, ont été insérés avec succès.',
    );
  }

  private async seedSkills() {
    const skillssPath = './src/database/data/skills.json';

    const skilljsonData = await fs.promises.readFile(skillssPath, 'utf-8');

    const skillData = JSON.parse(skilljsonData);

    for (const data of skillData) {
      await this.skillService.create(data);
    }

    this.logger.log(
      'Base de données : Les compétences ont été insérées avec succès.',
    );
  }

  private async seedLanguages() {
    try {
      const languagesPath = './src/database/data/languages.json';

      if (!fs.existsSync(languagesPath)) {
        this.logger.error('Fichier languages.json introuvable');
        return;
      }

      const languagesJsonData = await fs.promises.readFile(
        languagesPath,
        'utf-8',
      );
      const languageData = JSON.parse(languagesJsonData);

      if (!Array.isArray(languageData)) {
        throw new Error('Format de données invalide');
      }

      const results = await Promise.allSettled(
        languageData.map((data) => this.languageService.create(data)),
      );

      const errors = results.filter((r) => r.status === 'rejected');
      if (errors.length > 0) {
        this.logger.error(`${errors.length} erreurs d'insertion`, errors);
      }

      this.logger.log(
        `Base de données : ${languageData.length - errors.length} langues insérées avec succès`,
      );
    } catch (error) {
      this.logger.error("Échec de l'insertion des langues", error.stack);
    }
  }
}
