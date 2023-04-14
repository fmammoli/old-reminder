export default function Title({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center font-sans">
      <h1 className="text-4xl font-light font-sans delay-skin-alternate-close text-skin-muted ease-in-out">
        {title}
      </h1>
      <p className="text-md font-extralight italic  text-skin-base transition-colors delay-skin-alternate-close ease-in-out">
        {subtitle}
      </p>
    </div>
  );
}
