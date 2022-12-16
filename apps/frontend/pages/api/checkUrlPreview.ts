export default async function handler(req, res) {
  //   console.log('req.body.url: ', req.body.url);
  const { url } = req.body;
  const myRequest = new Request(url);

  const response = await fetch(myRequest, {
    method: 'HEAD',
    // mode: 'no-cors',
  }).then((response) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   @ts-ignore
    for (const pair of response.headers) {
      if (
        (pair[0].toLowerCase() === 'x-frame-options' &&
          pair[1].toLowerCase() === 'deny') ||
        pair[1].toLowerCase() === 'sameorigin' ||
        (pair[0].toLowerCase() === 'content-security-policy' &&
          pair[1].toLowerCase() === "frame-ancestors 'none'")
      ) {
        return {
          url,
          available: false,
        };
      }
    }
    return {
      url,
      available: true,
    };
    // console.log(...response.headers);
    // return response;
  });
  //   const headers = response.headers

  res.status(200).json(response);
  // return {
  // 	url,
  // 	available:
  // 	response.status === 200
  // };
}
