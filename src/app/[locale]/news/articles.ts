export interface Article {
  slug: string
  date: string
  views: number
  comments: number
  likes: number
  titleRu: string
  titleKz: string
  contentRu: ArticleSection[]
  contentKz: ArticleSection[]
}

export interface ArticleSection {
  type: 'heading' | 'paragraph' | 'link-group'
  text?: string
  links?: { label: string; href: string }[]
}

export const articles: Article[] = [
  {
    slug: 'robotics-lab-public-discussion',
    date: '18.06.2026',
    views: 0,
    comments: 0,
    likes: 0,
    titleRu:
      'Публичное обсуждение образовательной программы «Robotics Lab: робототехника в образовании»',
    titleKz:
      '«Robotics Lab: білім берудегі робототехника» білім беру бағдарламасын жария талқылау',
    contentRu: [
      {
        type: 'heading',
        text: 'Публичное обсуждение образовательной программы «Robotics Lab: робототехника в образовании»',
      },
      {
        type: 'paragraph',
        text: 'ТОО «USTEM Academy» предлагает образовательную программу курса повышения квалификации «Robotics Lab: робототехника в образовании» для педагогов организаций среднего, технического и профессионального, послесреднего и дополнительного образования, а также для педагогов, реализующих или планирующих реализовывать занятия, кружки, факультативы, проектные и практико-ориентированные курсы по робототехнике, STEM и программированию.',
      },
      {
        type: 'link-group',
        links: [
          {
            label:
              'Для ознакомления с образовательной программой перейдите по ссылке: RU ОП «Robotics Lab: робототехника в образовании»',
            href: '/docs/robotics-lab-ru.pdf',
          },
          {
            label: 'Предложения принимаются по ССЫЛКЕ до 26 июня 2026 года.',
            href: 'https://forms.gle/Tg96KPdvf8Mjo2vB6',
          },
        ],
      },
    ],
    contentKz: [
      {
        type: 'heading',
        text: '«Robotics Lab: білім берудегі робототехника» білім беру бағдарламасын жария талқылау',
      },
      {
        type: 'paragraph',
        text: '«USTEM Academy» ЖШС орта, техникалық және кәсіптік, орта білімнен кейінгі және қосымша білім беру ұйымдарының педагогтеріне, сондай-ақ робототехника, STEM және бағдарламалау бойынша сабақтарды, үйірмелерді, факультативтерді, жобалық және практикаға бағдарланған курстарды жүргізіп жүрген немесе жүргізуді жоспарлап отырған педагогтерге арналған «Robotics Lab: білім берудегі робототехника» біліктілікті арттыру курсының білім беру бағдарламасын ұсынады.',
      },
      {
        type: 'link-group',
        links: [
          {
            label:
              'Білім беру бағдарламасымен танысу үшін мына сілтемеге өтіңіз: KZ ОП «Robotics Lab: білім берудегі робототехника»',
            href: '/docs/robotics-lab-kz.pdf',
          },
          {
            label:
              'Ұсыныстар 2026 жылғы 26 маусымына дейін ОСЫ СІЛТЕМЕДЕ қабылданады.',
            href: 'https://forms.gle/PSZ91XMrbVcm78rQA',
          },
        ],
      },
    ],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}
