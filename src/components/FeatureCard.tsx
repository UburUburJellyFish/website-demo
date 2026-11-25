type FeatureCardProps = {
  title: string;
  body: string;
};

export function FeatureCard({ title, body }: FeatureCardProps) {
  return (
    <article className="rounded-3xl bg-tile p-6">
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-2">{body}</p>
    </article>
  );
}
