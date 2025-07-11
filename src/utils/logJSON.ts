/* eslint-disable no-console */
export const logJSON = {
  response(method: string, json: any) {
    console.log(
      `%c${method} response`,
      'color: #2f9e44; font-weight: 600; font-size: 18px',
    );
    console.log(json);
  },
  error(method: string, json: any) {
    console.log(
      `%c${method} error`,
      'color: #ef4444; font-weight: 600; font-size: 18px',
    );
    console.log(json);
  },
  BE(title: string, json: any) {
    console.log(
      `%cBackEnd ${title} response`,
      'color: #3b82f6; font-weight: 600; font-size: 18px',
    );
    console.log(json);
  },
  info(title: string, json: any) {
    console.log(
      `%c${title}`,
      'color: #3b82f6; font-weight: 600; font-size: 18px',
    );
    console.log(json);
  },
};
