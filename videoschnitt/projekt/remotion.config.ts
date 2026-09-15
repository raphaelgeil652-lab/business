import {Config} from '@remotion/cli/config';

// JPEG statt PNG: deutlich schneller beim Rendern, kein sichtbarer Unterschied im Video.
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Qualitaet fuer Instagram/TikTok/Meta-Ads: CRF 18 ist sehr gut, 23 ist Standard.
Config.setCrf(18);
