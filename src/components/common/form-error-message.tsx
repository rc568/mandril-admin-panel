interface Props {
  text: string;
}

export const FormErrorMessage = ({ text }: Props) => {
  return <span className="text-xs text-destructive">{text}</span>;
};
