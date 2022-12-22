export default async function handler(req, res) {
  const { url } = req.body;
  const myRequest = new Request(url);

  const response = await fetch(myRequest, {
    method: 'HEAD',
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
  });

  res.status(200).json(response);
}
