import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import {
  ANGULAR_RESET_PASSWORD_VIEW,
  APP_LOGO,
  CANDIDATE_URL,
  FRONT_LOGIN,
  FRONT_OFFER_URL,
} from 'src/common/constants';


@Injectable()
export class EmailService {
  private mailTransport: Transporter;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.mailTransport = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: Number(this.configService.get('MAIL_PORT')),
      secure: false, // TODO: upgrade later with STARTTLS
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(
    data: SendEmailDto,
  ): Promise<{ success: boolean; message: string }> {
    const { sender, recipients, subject, html, text } = data;

    const mailOptions: SendMailOptions = {
      from: sender ?? {
        name: this.configService.get('MAIL_SENDER_NAME_DEFAULT'),
        address: this.configService.get('MAIL_SENDER_DEFAULT'),
      },
      to: recipients,
      subject,
      html,
      text,
    };

    try {
      await this.mailTransport.sendMail(mailOptions);
      return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
      throw new ServiceUnavailableException({
        error: 'Email service unavailable',
        message:
          "Nous n'avons pas pu envoyer l'email d'activation. Veuillez réessayer plus tard.",
      });
    }
  }

  async generateResetToken(userEmail: string) {
    return this.jwtService.sign(
      { sub: userEmail },
      { secret: this.configService.get('jwtRefreshSecret'), expiresIn: '24h' },
    );
  }

  sendResetPasswordEmail = async (name: string, email: any) => {
    const token = await this.generateResetToken(email);

    await this.sendEmail({
      sender: {
        name: 'Équipe Support',
        address: 'recrutement@interim-online.fr',
      },
      subject: 'Réinitialisation de votre mot de passe',
      recipients: [{ name: name, address: email }],
      html: `
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${APP_LOGO}" alt="Intérim-Online-logo" style="max-width: 180px;">
          </div>
          <p>Bonjour <strong>${name}</strong>,</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          <p>
            Pour choisir un nouveau mot de passe, veuillez cliquer sur le lien ci-dessous&nbsp;:<br>
            <a href="${ANGULAR_RESET_PASSWORD_VIEW}?token=${token}" style="color: #007BFF; text-decoration: none; font-weight: bold;">
              Réinitialiser mon mot de passe
            </a>
          </p>
          <p>
            Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email.<br>
            Ce lien expirera dans 24 heure pour des raisons de sécurité.
          </p>
          <p>Merci pour votre confiance,<br>
          L’équipe <strong>Intérim-Online</strong></p>
          <hr style="margin-top: 30px;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            www.interim-online.fr | recrutement@interim-online.fr
          </p>
        </div>
      `,
    });
  };

  async sendWelcomeEmail(email: string) {
    const tempPassword = 'admin1234'; // Mot de passe temporaire

    await this.sendEmail({
      sender: {
        name: 'Équipe Support',
        address: 'recrutement@interim-online.fr',
      },
      subject: 'Vos identifiants de connexion temporaires',
      recipients: [{ name: null, address: email }],
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px;">
      <h2 style="color: #2c3e50;">Bienvenue sur notre plateforme</h2>
      
      <p>Bonjour,</p>
      
      <p>Votre compte a été créé avec succès. Voici vos identifiants temporaires :</p>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;">
          <strong>Email :</strong> ${email}<br>
          <strong>Mot de passe temporaire :</strong> <span style="color: #dc3545;">${tempPassword}</span>
        </p>
      </div>

      <p>Pour votre sécurité, vous devez :</p>
      <ol style="margin-top: 0;">
        <li>Vous connecter via <a href="${FRONT_LOGIN}" style="color: #007bff;">ce lien</a></li>
        <li>Changer immédiatement votre mot de passe dans les paramètres du compte</li>
      </ol>

      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #856404;">
          ⚠️ Ce mot de passe est temporaire et expirera après votre première connexion.
          Toute connexion non suivie d'un changement de mot de passe sera bloquée.
        </p>
      </div>

      <p>En cas de difficultés, contactez-nous .</p>

      <p>Cordialement,<br>
      <strong>L'équipe Support</strong></p>
    </div>
    `,
    });
  }

  async sendCandidatureConfirmation(
    name: string,
    email: string,
    titreOffer: string,
    offreId: string,
  ) {
    const offerUrl = `${FRONT_OFFER_URL}/${offreId}`;

    await this.sendEmail({
      sender: {
        name: 'Équipe Support', 
        address: 'recrutement@interim-online.fr',
      },
      subject: 'Votre Candidature a été Reçue avec Succès',
      recipients: [{ name: name, address: email }],
      html: `
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${APP_LOGO}" alt="Intérim-Online-logo" style="max-width: 180px;">
        </div>

        <p>Bonjour <strong>${name}</strong>,</p>

        <p>Nous vous confirmons la bonne réception de votre candidature.</p>

        <p>
          Vous avez postulé à l'offre suivante :<br>
          <a href="${offerUrl}" style="color: #007BFF; text-decoration: none; font-weight: bold;">
            ${titreOffer}
          </a>
        </p>

        <p>
          Notre équipe étudiera votre profil dans les plus brefs délais.<br>
          Vous serez informé(e) par email dès qu’une suite sera donnée à votre candidature.
        </p>

        <p>Merci pour votre confiance,<br>
        L’équipe <strong>Intérim-Online</strong></p>

        <hr style="margin-top: 30px;">

        <p style="font-size: 12px; color: #999; text-align: center;">
          www.interim-online.fr | recrutement@interim-online.fr
        </p>
      </div>
    `,
    });
  }

  async sendCandidatureNotification(
    recipients: { name: string; address: string }[],
    titreOffer: string,
    offreId: string,
    candidateId: string,
  ) {
    const offerUrl = `${FRONT_OFFER_URL}/${offreId}`;
    const candidateUrl = `${CANDIDATE_URL}/${candidateId}`;
    // Loop through each recipient and send an email
    for (const recipient of recipients) {
      try {
        await this.sendEmail({
          sender: {
            name: 'Équipe Support',
            address: 'recrutement@interim-online.fr',
          },
          subject: 'Nouvelle candidature reçue',
          recipients: [recipient], // Send to one recipient at a time
          html: `
          <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${APP_LOGO}" alt="Intérim-Online-logo" style="max-width: 180px;">
          </div>

          <p>Bonjour,</p>

          <p>Une nouvelle candidature vient d’être déposée pour l’offre suivante :</p>

          <p style="margin: 20px 0;">
            <a href="${offerUrl}" style="font-size: 16px; color: #007BFF; text-decoration: none; font-weight: bold;">
              ${titreOffer}
            </a>
          </p>

          <p>
            Vous pouvez également consulter le profil du candidat ici :<br>
            <a href="${candidateUrl}" style="font-size: 15px; color: #28a745; text-decoration: none;">
              Voir le profil du candidat
            </a>
          </p>

          <p>Merci,  
          <br>L’équipe <strong>Intérim-Online</strong></p>

          <hr style="margin-top: 30px;">

          <p style="font-size: 12px; color: #999; text-align: center;">
            www.interim-online.fr | recrutement@interim-online.fr
          </p>
        </div>
        `,
        });
      } catch (error) {
        console.error(
          `Error sending email to ${recipient.name} (${recipient.address}):`,
          error,
        );
      }
    }
  }
}
