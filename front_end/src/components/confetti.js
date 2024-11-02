import { useState, useEffect } from "react"
import confetti from 'canvas-confetti'

const scalar = 2
let shapes = ['square', 'circle', 'star']

if(typeof OffscreenCanvas !== 'undefined') {
  shapes = [
    confetti.shapeFromText({ text: '🦄', scalar }),
    confetti.shapeFromText({ text: '🇨🇷', scalar }),
  ]
}

const defaults = {
  spread: 360,
  ticks: 60,
  gravity: 0,
  decay: 0.96,
  startVelocity: 20,
  shapes,
  scalar,
}

export default function Confetti() {

  const partyTime = () => {
    confetti({
      ...defaults,
      particleCount: 30
    })

    confetti({
      ...defaults,
      particleCount: 5,
      flat: true
    })

    confetti({
      ...defaults,
      particleCount: 15,
      scalar: scalar / 2,
      shapes: ['circle']
    })
  }

  useEffect(() => {
    setTimeout(partyTime, 0)
    setTimeout(partyTime, 100)
    setTimeout(partyTime, 200)
  }, [])

  return null
}