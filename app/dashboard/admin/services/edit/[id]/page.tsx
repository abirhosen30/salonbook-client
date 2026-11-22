import ServiceForm from "@/components/dashboard/ServiceForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  return <ServiceForm serviceId={id} />;
}
