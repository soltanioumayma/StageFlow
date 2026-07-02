
const { sendEmail } = require('./email.service');
const logger = require('../utils/logger');


const emailQueue = new Map();
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 secondes


const addToQueue = async (type, email, prenom, reference, candidatureId) => {
  const jobId = Date.now();
  
  const job = {
    id: jobId,
    type,
    email,
    prenom,
    reference,
    candidatureId,
    attempts: 0,
    status: 'pending',
    createdAt: new Date(),
  };
  
  emailQueue.set(jobId, job);
  logger.info('Email ajouté à la queue', { jobId, type, email });
  
  // Traiter le job
  processJob(jobId);
  
  return jobId;
};


const processJob = async (jobId) => {
  const job = emailQueue.get(jobId);
  if (!job) return;
  
  job.status = 'processing';
  job.attempts++;
  
  try {
    await sendEmail(job.type, job.email, job.prenom, job.reference, job.candidatureId);
    job.status = 'completed';
    job.completedAt = new Date();
    logger.info('Email envoyé avec succès', { jobId, type: job.type });
    
    // Supprimer le job après un délai
    setTimeout(() => emailQueue.delete(jobId), 60000);
  } catch (err) {
    logger.error('Erreur envoi email', { jobId, error: err.message, attempt: job.attempts });
    
    if (job.attempts < MAX_RETRIES) {
      job.status = 'retrying';
      job.nextRetryAt = new Date(Date.now() + RETRY_DELAY * job.attempts);
      logger.info('Email en retry', { jobId, nextRetryAt: job.nextRetryAt });
      
      // Retarder le retry
      setTimeout(() => processJob(jobId), RETRY_DELAY * job.attempts);
    } else {
      job.status = 'failed';
      job.failedAt = new Date();
      job.error = err.message;
      logger.error('Email échoué après tous les retries', { jobId, error: err.message });
    }
  }
};


const getJobStatus = (jobId) => {
  return emailQueue.get(jobId);
};


const getQueueStats = () => {
  const jobs = Array.from(emailQueue.values());
  return {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    processing: jobs.filter(j => j.status === 'processing').length,
    retrying: jobs.filter(j => j.status === 'retrying').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };
};

module.exports = {
  addToQueue,
  processJob,
  getJobStatus,
  getQueueStats,
};



