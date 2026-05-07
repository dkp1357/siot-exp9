import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  modelsLoaded = true;
}

/**
 * Detect a single face from a video or image element and return the 128-d descriptor.
 * @param {HTMLVideoElement | HTMLCanvasElement | HTMLImageElement} input
 * @returns {Promise<Float32Array>} 128-d face descriptor
 * @throws {Error} if no face or multiple faces detected
 */
export async function getFaceDescriptor(input) {
  const detections = await faceapi
    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (detections.length === 0) {
    throw new Error('No face detected. Please position your face clearly in the camera.');
  }
  if (detections.length > 1) {
    throw new Error('Multiple faces detected. Please ensure only your face is visible.');
  }

  return Array.from(detections[0].descriptor);
}
