import React from "react";
type EditRequestPageProps = {
  params:Promise<{ requestId: string }>
}

export default async function EditRequestPage({params}:EditRequestPageProps) {

  const {requestId} = await params;

  return (
    <div>
      <h1>下書き編集</h1>
      {`EditPage ${requestId}`}
    </div>
  );
}
