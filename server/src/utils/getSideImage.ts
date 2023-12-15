export function getSideImage(input: string) {
  return {
    $arrayElemAt: [
      {
        $filter: {
          input,
          as: 'img',
          cond: {
            $or: [
              {
                $regexMatch: {
                  input: '$$img',
                  regex: 'left|profile|lat|1-min|^((?!closeup).)*pink-1',
                  options: 'i',
                },
              },
            ],
          },
        },
      },
      0,
    ],
  }
}
