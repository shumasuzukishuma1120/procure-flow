'use client'

import { Button } from '@/components/ui/button'
import CancelSubmittedRequestDialog from '@/features/requests/components/cancel-submitted-request-dialog'
import DeleteDraftRequestDialog from '@/features/requests/components/delete-draft-request-dialog'
import { RequestDetailResponse } from '@/features/requests/types'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RequestDetailActions({request}: {request: RequestDetailResponse}) {

  const router = useRouter()

  return (
            <div className="flex gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href="/requests" />}>
            <ArrowLeft aria-hidden="true" />
            一覧へ戻る
          </Button>
          {request.status === "DRAFT" && (
            <>
              <DeleteDraftRequestDialog
                requestId={request.requestId}
                requestTitle={request.title}
                version={request.version}
                onSuccess={() => router.replace('/requests')}
              />
              <Button
                nativeButton={false}
                render={<Link href={`/requests/${encodeURIComponent(request.requestId)}/edit`} />}
              >
                <Pencil aria-hidden="true" />
                編集する
              </Button>
            </>
          )}
          {request.status === "SUBMITTED" && (
            <>
              <CancelSubmittedRequestDialog
                requestId={request.requestId}
                requestTitle={request.title}
                version={request.version}
                onSuccess={() => router.replace('/requests')}
              />
            </>
          )}
        </div>
  )
}
