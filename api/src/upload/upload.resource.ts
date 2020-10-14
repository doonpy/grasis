const uploadFolderPath = './files';

export const UPLOAD_CONTROLLER_RESOURCE = {
  PATH: {
    ROOT: 'upload',
    AVATAR: '/avatar'
  },
  BODY: {
    AVATAR: 'avatar'
  }
};

export const UPLOAD_DESTINATION = {
  AVATAR: `${uploadFolderPath}/avatar`
};

export const FILE_SIZE = {
  AVATAR: 2097152
};
