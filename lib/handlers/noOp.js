export const listener = (event) => {
  event.preventDefault()
  event.stopPropagation()
}

export const noOpSubscription = {
  event: 'no-op',
  listener
}
