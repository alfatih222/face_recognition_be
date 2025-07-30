import * as canvas from 'canvas';
import * as faceapi from '@vladmandic/face-api';
import * as path from 'path';
import * as fs from 'fs';

export async function initializeFaceRecognition(): Promise<void> {
  const { Canvas, Image, ImageData } = canvas;
  faceapi.env.monkeyPatch({ Canvas: Canvas as any, Image: Image as any, ImageData: ImageData as any });

  const modelBasePath = path.join(__dirname, '../models/models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(modelBasePath, 'ssd_mobilenetv1'));
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(modelBasePath, 'face_recognition'));
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(modelBasePath, 'face_landmark_68'));
}

export async function face_recognition(user: any, faceCache: Map<string, faceapi.LabeledFaceDescriptors>): Promise<faceapi.LabeledFaceDescriptors | null> {
  if (faceCache.has(user.id)) {
    return faceCache.get(user.id)!;
  }
  if (!user || !user.file) return null;

  const imagePath = path.resolve(__dirname, `../uploads/face/${user.file}`);
  if (!fs.existsSync(imagePath)) return null;

  try {
    const image = await canvas.loadImage(imagePath);
    const detection = await faceapi
      .detectSingleFace(image as any)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      const descriptor = new faceapi.LabeledFaceDescriptors(user.id, [detection.descriptor]);
      faceCache.set(user.id, descriptor);
      return descriptor;
    }
  } catch (err) {
    console.log(`Failed to load face image for user ${user.id}: ${err.message}`);
  }

  return null;
}
