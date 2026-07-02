const nodemailer = require('nodemailer');
const Notification = require('../models/Notification.model');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const templates = {

  confirmation: (prenom, reference) => ({
    sujet: `Candidature reçue – Référence ${reference} | Groupe RIF`,
    corps: `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Candidature reçue – Groupe RIF</title></head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
        <tr><td align="center">
          <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.10);">
            <tr>
              <td style="background:linear-gradient(135deg,#1d4ed8 0%,#1e40af 100%);padding:40px 48px;text-align:center;">
                <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;font-weight:700;">Groupe RIF</p>
                <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">Candidature bien reçue</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:44px 48px 36px;">
                <p style="margin:0 0 24px;font-size:16px;color:#111827;line-height:1.6;">Bonjour <strong>${prenom}</strong>,</p>
                <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.8;">
                  Votre candidature au sein du <strong>Groupe RIF</strong> a bien été enregistrée dans notre système.
                  Nous vous remercions de l'intérêt que vous portez à notre organisation.
                </p>
                <p style="margin:0 0 28px;font-size:15px;color:#4b5563;line-height:1.8;">
                  Notre équipe RH procédera à l'examen de votre dossier dans les meilleurs délais.
                  Vous trouverez ci-dessous votre référence unique de suivi :
                </p>
                <div style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:12px;padding:24px;text-align:center;margin:0 0 32px;">
                  <p style="margin:0 0 8px;font-size:11px;color:#3b82f6;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Référence de dossier</p>
                  <p style="margin:0;font-size:32px;font-weight:800;color:#1d4ed8;letter-spacing:4px;">${reference}</p>
                </div>
                <p style="margin:0 0 8px;font-size:15px;color:#4b5563;line-height:1.8;">Conservez cette référence et votre adresse e-mail pour consulter l'état de votre candidature.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:28px 48px;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#111827;">Direction des Ressources Humaines</p>
                <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#1d4ed8;">Groupe RIF</p>
                <p style="margin:0;font-size:12px;color:#9ca3af;">rh@grouperif.com</p>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;text-align:center;">Message automatique – Merci de ne pas répondre à cet email.</p>
        </td></tr>
      </table>
    </body></html>
    `,
  }),

  acceptation: (prenom, reference) => ({
    sujet: `Votre candidature a été retenue – Groupe RIF`,
    corps: `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Candidature retenue – Groupe RIF</title></head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
        <tr><td align="center">
          <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.10);">

            <!-- Header vert -->
            <tr>
              <td style="background:linear-gradient(135deg,#059669 0%,#047857 100%);padding:44px 48px;text-align:center;">
                <div style="width:60px;height:60px;background:rgba(255,255,255,0.15);border-radius:50%;margin:0 auto 18px;line-height:60px;font-size:30px;text-align:center;">✓</div>
                <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.75);letter-spacing:3px;text-transform:uppercase;font-weight:700;">Groupe RIF – Ressources Humaines</p>
                <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">Candidature retenue</h1>
              </td>
            </tr>

            <!-- Corps -->
            <tr>
              <td style="padding:44px 48px 12px;">
                <p style="margin:0 0 24px;font-size:16px;color:#111827;line-height:1.6;">Madame, Monsieur <strong>${prenom}</strong>,</p>
                <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.8;">
                  Nous avons bien reçu et étudié avec la plus grande attention votre candidature
                  enregistrée sous la référence <strong style="color:#059669;">${reference}</strong>.
                </p>
                <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.8;">
                  C'est avec grand plaisir que nous vous informons que votre profil a été sélectionné
                  et que votre candidature a été <strong>officiellement retenue</strong> par notre équipe
                  de recrutement.
                </p>
                <p style="margin:0 0 32px;font-size:15px;color:#4b5563;line-height:1.8;">
                  Vos compétences, votre parcours académique et la qualité de votre dossier correspondent
                  pleinement aux critères recherchés par <strong>Groupe RIF</strong>.
                </p>
              </td>
            </tr>

            <!-- Encadré prochaine étape -->
            <tr>
              <td style="padding:0 48px 32px;">
                <div style="background:#ecfdf5;border-left:5px solid #059669;border-radius:0 12px 12px 0;padding:24px 28px;">
                  <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#047857;text-transform:uppercase;letter-spacing:2px;">Prochaine étape</p>
                  <p style="margin:0;font-size:15px;color:#065f46;line-height:1.8;">
                    Un(e) chargé(e) de recrutement du <strong>Groupe RIF</strong> vous contactera
                    <strong>prochainement</strong> par e-mail ou par téléphone afin de vous convoquer
                    à un <strong>entretien technique</strong>. Nous vous invitons à rester attentif(ve)
                    à votre messagerie dans les jours à venir.
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 48px 40px;">
                <p style="margin:0 0 8px;font-size:15px;color:#4b5563;line-height:1.8;">
                  Nous vous félicitons chaleureusement et vous remercions de la confiance que vous accordez
                  à notre organisation. Nous avons hâte de vous accueillir.
                </p>
                <p style="margin:0;font-size:15px;color:#4b5563;">Cordialement,</p>
              </td>
            </tr>

            <!-- Signature -->
            <tr>
              <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:28px 48px;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#111827;">Direction des Ressources Humaines</p>
                <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#059669;">Groupe RIF</p>
                <p style="margin:0 0 2px;font-size:12px;color:#6b7280;">rh@grouperif.com</p>
                <p style="margin:0;font-size:11px;color:#9ca3af;">Réf. dossier : ${reference}</p>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;text-align:center;">Message automatique – Merci de ne pas répondre à cet email.</p>
        </td></tr>
      </table>
    </body></html>
    `,
  }),

  refus: (prenom, reference) => ({
    sujet: `Résultat de votre candidature – Groupe RIF`,
    corps: `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Résultat candidature – Groupe RIF</title></head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
        <tr><td align="center">
          <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.10);">

            <!-- Header sobre gris anthracite -->
            <tr>
              <td style="background:linear-gradient(135deg,#1f2937 0%,#111827 100%);padding:40px 48px;text-align:center;">
                <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:3px;text-transform:uppercase;font-weight:700;">Groupe RIF – Ressources Humaines</p>
                <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">Suite donnée à votre candidature</h1>
              </td>
            </tr>

            <!-- Corps -->
            <tr>
              <td style="padding:44px 48px 28px;">
                <p style="margin:0 0 24px;font-size:16px;color:#111827;line-height:1.6;">Madame, Monsieur <strong>${prenom}</strong>,</p>
                <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.8;">
                  Nous vous remercions sincèrement de l'intérêt que vous avez manifesté à l'égard du
                  <strong>Groupe RIF</strong>, ainsi que du soin apporté à la constitution de votre dossier
                  de candidature (réf. <strong>${reference}</strong>).
                </p>
                <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.8;">
                  Après une analyse attentive de votre profil par notre équipe de recrutement, nous avons
                  le regret de vous informer que nous ne sommes pas en mesure de donner une suite favorable
                  à votre candidature pour cette session.
                </p>
                <p style="margin:0 0 32px;font-size:15px;color:#4b5563;line-height:1.8;">
                  Cette décision ne reflète en aucun cas la valeur de votre profil, mais correspond aux
                  besoins et aux priorités de l'organisation à ce moment précis.
                </p>
              </td>
            </tr>

            <!-- Encadré encouragement -->
            <tr>
              <td style="padding:0 48px 32px;">
                <div style="background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:12px;padding:24px 28px;">
                  <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#374151;">Un mot de notre équipe</p>
                  <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.8;font-style:italic;">
                    « Le Groupe RIF est attentif à chaque candidature et reconnaît la valeur de chaque
                    parcours. Nous conservons votre dossier dans notre base et ne manquerons pas de revenir
                    vers vous si une opportunité correspondant à vos compétences venait à s'ouvrir
                    prochainement. »
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 48px 40px;">
                <p style="margin:0 0 8px;font-size:15px;color:#4b5563;line-height:1.8;">
                  Nous vous encourageons vivement à soumettre à nouveau votre candidature lors de
                  nos prochaines sessions de recrutement.
                </p>
                <p style="margin:0 0 8px;font-size:15px;color:#4b5563;">
                  Nous vous souhaitons pleine réussite dans vos démarches.
                </p>
                <p style="margin:0;font-size:15px;color:#4b5563;">Cordialement,</p>
              </td>
            </tr>

            <!-- Signature -->
            <tr>
              <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:28px 48px;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#111827;">Direction des Ressources Humaines</p>
                <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#374151;">Groupe RIF</p>
                <p style="margin:0 0 2px;font-size:12px;color:#6b7280;">rh@grouperif.com</p>
                <p style="margin:0;font-size:11px;color:#9ca3af;">Réf. dossier : ${reference}</p>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;text-align:center;">Message automatique – Merci de ne pas répondre à cet email.</p>
        </td></tr>
      </table>
    </body></html>
    `,
  }),
};



const sendEmail = async (type, emailDest, prenom, reference, candidatureId) => {
  const template = templates[type](prenom, reference);

  let statut = 'envoye';
  let sendError = null;

  try {
    await transporter.sendMail({
      from:    `"Groupe RIF – Ressources Humaines" <${process.env.EMAIL_USER}>`,
      replyTo: 'rh@grouperif.com',
      to:      emailDest,
      subject: template.sujet,
      html:    template.corps,
    });
    logger.info(`Email "${type}" envoyé à ${emailDest}`, { candidatureId });
  } catch (err) {

    logger.error(`Email "${type}" échoué pour ${emailDest}`, { error: err.message, candidatureId });
    statut = 'echec';
    sendError = err;
  }

  try {
    await Notification.create({
      candidature_id: candidatureId,
      type_notif: type,
      email_dest: emailDest,
      sujet: template.sujet,
      statut,
    });
  } catch (notifErr) {
    logger.error(`Erreur enregistrement notification "${type}"`, {
      error: notifErr.message,
      candidatureId,
      emailDest,
    });
  }

  if (sendError) {
    throw sendError;
  }
};

module.exports = { sendEmail };


