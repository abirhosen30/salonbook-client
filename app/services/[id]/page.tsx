import ServiceDetails from "@/components/services/ServiceDetails";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params;
  return <ServiceDetails id={id} />;
}
