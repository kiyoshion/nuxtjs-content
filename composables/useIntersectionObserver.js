import { Ref } from 'vue';

const doObserve = ((els) => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  }

  els.forEach((el, i) => {
    const observer = new IntersectionObserver((items) => {
      items.forEach((item) => {
        if (item.isIntersecting && item.target.classList.contains('-delay')) {
          const delay = 300 * i
          setTimeout(() => {
            item.target.classList.add('-intersecting')
          }, delay)
        } else if (item.isIntersecting) {
          item.target.classList.add('-intersecting')
        } else {
          item.target.classList.remove('-intersecting')
        }

        if (item.isIntersecting && item.target.classList.contains('-once')) {
          observer.unobserve(el.value)
        }
      })
    }, options)
    observer.observe(el.value)
  })
})

export const useIntersectionObserver = () => {
  return {
    doObserve
  }
}
