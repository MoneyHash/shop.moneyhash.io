// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'src-mark': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { dark?: boolean; height?: number };
    'src-loader': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { dark?: boolean };
    'src-card-list': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { dark?: boolean; background?: string };
    'src-otp-input': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { dark?: boolean; length?: number };
    'src-code-input': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { dark?: boolean };
    'src-consent': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { dark?: boolean };
  }
}
