'use client'

import React, { ReactElement } from 'react'

import withAuth from '@/app/[locale]/components/with-auth'
import Hero from '@/app/[locale]/_components/hero'
import Navbar from '@/app/[locale]/components/layout/Navbar'
import FirstDescription from './_components/first-description'
import OurResults from './_components/our-results'
import Values from './_components/values'
import OurPrograms from './_components/our-programs'
import Events from './_components/events'
import Partners from './_components/partners'
import PublicDiscussion from './_components/public-discussion'

const Home = (): ReactElement => {
  return (
    <>
      <Hero />
      <FirstDescription />
      <OurResults />
      <OurPrograms />
      <PublicDiscussion />
      <Events />
    </>
  )
}

export default withAuth(Home)
