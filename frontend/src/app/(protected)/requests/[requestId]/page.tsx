type DetailRequestPageProps = {
  params: Promise<{ requestId: string }>;
};

export default async function DetailRequestPage({ params }: DetailRequestPageProps) {
  const { requestId } = await params;

  return (
    <div>
      <h1>申請詳細</h1>
      <p>申請ID: {requestId}</p>
    </div>
  );
}
