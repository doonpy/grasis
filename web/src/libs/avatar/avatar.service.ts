import { message } from 'antd';
import { RcFile } from 'antd/lib/upload';

export function getBase64(img: Blob, callback: (imageUrl: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result ? reader.result.toString() : ''));
  reader.readAsDataURL(img);
}

export function beforeUpload(file: RcFile) {
  const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isValidType) {
    message.error('Ảnh đại diện phải có định dạng JPG/PNG!');
  }

  const isValidSize = file.size / 1024 / 1024 < 2;
  if (!isValidSize) {
    message.error('Ảnh đại diện phải nhỏ hơn 2MB!');
  }

  return isValidType && isValidSize;
}

export function getAvatarUrl(userId: number) {
  if (process.env.NEXT_PUBLIC_HEROKU_PR_NUMBER) {
    return `https://grasis-api-pr-${process.env.NEXT_PUBLIC_HEROKU_PR_NUMBER}.herokuapp.com/avatar/${userId}`;
  }

  return `${process.env.NEXT_PUBLIC_API_SERVER}/avatar/${userId}`;
}
