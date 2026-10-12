import { permanentRedirect } from 'next/navigation'

/* Legacy URL: both public consultations now live in the «Ашық диалог» table
   on /academy (TZ §4, §8.2). */
export default function PublicDiscussionPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  permanentRedirect(`/${locale}/academy#discussion`)
}
