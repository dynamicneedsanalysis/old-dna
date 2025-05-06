export const mdxComponents = {
  h2: (props: string[]) => (
    <h2 className="my-2 text-center text-3xl font-bold" {...props} />
  ),
  h3: (props: string[]) => (
    <h3 className="mb-2 text-xl font-semibold" {...props} />
  ),
  h4: (props: string[]) => (
    <h4
      className="mb-4 text-center text-lg font-bold break-all sm:text-2xl"
      {...props}
    />
  ),
  ul: (props: string[]) => <ul className="mb-4 list-disc" {...props} />,
  ol: (props: string[]) => <ol className="mb-4 list-decimal" {...props} />,
  li: (props: string[]) => <li className="mb-2 ml-10 sm:ml-12" {...props} />,
  p: (props: string[]) => <p className="mb-4 ml-2 sm:ml-4" {...props} />,
  hr: (props: string[]) => <hr className="my-6 border-gray-400" {...props} />,
};
