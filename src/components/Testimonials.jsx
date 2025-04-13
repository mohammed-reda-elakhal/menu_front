import React from 'react'
import { FaQuoteLeft, FaStar } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { useTranslation } from 'react-i18next'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  {
    name: "Mohamed Alami",
    role: "Owner, Café Marrakech",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    quote: "بفضل Menuso، أصبحت إدارة قائمة مطعمنا أسهل بكثير. العملاء يحبون التصميم العصري والوصول السهل عبر رمز QR.",
    rating: 5,
    location: "Marrakech"
  },
  {
    name: "Samira Benjelloun",
    role: "Manager, Restaurant Casablanca",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    quote: "خدمة ممتازة وسهلة الاستخدام. التحديثات الفورية للقائمة توفر الكثير من الوقت والجهد.",
    rating: 5,
    location: "Casablanca"
  },
  {
    name: "Karim Tazi",
    role: "Owner, Café Tangier",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    quote: "أفضل استثمار قمت به لمطعمي. النظام سهل الاستخدام والدعم الفني ممتاز.",
    rating: 5,
    location: "Tangier"
  },
  {
    name: "Fatima Zahra",
    role: "Owner, Restaurant Fes",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    quote: "تجربة رائعة! التطبيق سهل الاستخدام وساعدنا في تحسين خدمة العملاء بشكل كبير.",
    rating: 5,
    location: "Fes"
  },
  {
    name: "Hassan El Mansouri",
    role: "Manager, Café Agadir",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    quote: "منذ استخدام Menuso، لاحظنا زيادة في رضا العملاء وتحسن في كفاءة خدمتنا.",
    rating: 5,
    location: "Agadir"
  },
  {
    name: "Layla Bennani",
    role: "Owner, Restaurant Rabat",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    quote: "نظام رائع وفريق دعم متميز. أنصح به بشدة لكل مطعم يريد مواكبة التطور التقني.",
    rating: 5,
    location: "Rabat"
  }
]

function Testimonials() {
  const { t } = useTranslation()

  return (
    <div className="bg-secondary1 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('testimonials.title.part1')}{' '}
            <span className="text-primary">{t('testimonials.title.part2')}</span>{' '}
            {t('testimonials.title.part3')}
          </h2>
          <p className="text-gray_bg text-lg max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-16 !pt-4"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="pb-8">
              <div
                className="bg-secondary1 p-8 rounded-2xl border-2 border-primary/20
                  hover:border-primary/40 transition-colors duration-300 h-full
                  shadow-lg hover:shadow-primary/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-primary"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-gray_bg text-sm">{testimonial.role}</p>
                    <p className="text-primary text-sm">{testimonial.location}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <FaQuoteLeft className="text-primary/40 text-2xl mb-2" />
                  <p className="text-gray_bg text-right">{testimonial.quote}</p>
                </div>

                <div className="flex items-center justify-end gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-primary" />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Testimonials