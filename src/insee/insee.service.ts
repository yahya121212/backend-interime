import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { INSEE_TOKEN_URL } from 'src/common/constants';

@Injectable()
export class InseeService {
  private tokenCache: { accessToken: string; expiresAt: number } = {
    accessToken: '',
    expiresAt: 0,
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // Méthode pour générer un nouveau token
  private async getNewToken(): Promise<string> {
    const url = this.configService.get<string>(
      'INSEE_TOKEN_URL',
      INSEE_TOKEN_URL,
    );
    const clientId = this.configService.get<string>('INSEE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('INSEE_CLIENT_SECRET');

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, 'grant_type=client_credentials', {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${clientId}:${clientSecret}`,
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      const { access_token, expires_in } = response.data;
      this.tokenCache.accessToken = access_token;
      this.tokenCache.expiresAt = Date.now() + expires_in * 1000;

      return access_token;
    } catch (error) {
      console.error(
        'Erreur lors du renouvellement du token :',
        error.response?.data || error.message,
      );
      throw new HttpException('Erreur lors de la génération du token', 500);
    }
  }

  // Méthode pour récupérer le token valide
  private async getToken(): Promise<string> {
    if (
      !this.tokenCache.accessToken ||
      Date.now() > this.tokenCache.expiresAt
    ) {
      // Token expiré, génération d’un nouveau token...
      return this.getNewToken();
    }
    // Token valide, utilisation du token en cache.
    return this.tokenCache.accessToken;
  }

  // Méthode pour interroger l'API Sirene
  public async fetchSiretData(siret: string): Promise<any> {
    const token = await this.getToken();
    const url = `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new NotFoundException(
        `Aucun élément trouvé pour le siret ${siret}`,
      );
    }
  }
}
