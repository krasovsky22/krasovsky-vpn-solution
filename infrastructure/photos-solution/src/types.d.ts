type SuccessResponseType = {
  success: true;
  data: any;
};

type FailedResponseType = {
  success: false;
  error: string;
};

export type RecordProcessingResponse = SuccessResponseType | FailedResponseType;
