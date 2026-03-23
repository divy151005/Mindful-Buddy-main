export type AnswerType = "yes" | "no" | null

export interface MChatQuestion {
  id: number
  question: string
  description: string
  observationPrompt: string
  criticalItem: boolean
  reverseScored?: boolean
  visualTest?: boolean
  testType?: string
  behavioralAreas: Array<"eye-contact" | "social-interaction" | "response-to-name" | "repetitive-behavior">
}

export interface FollowUpQuestion {
  id: string
  parentQuestionId: number
  prompt: string
  behaviorArea: MChatQuestion["behavioralAreas"][number]
}

export const mchatQuestions: MChatQuestion[] = [
  {
    id: 1,
    question: "If you point at something across the room, does your child look at it?",
    description: "For example, if you point at a toy or an animal, does your child look at the toy or animal?",
    observationPrompt: "Try this during normal play. Point to a nearby toy, pet, or picture and notice whether your child follows your point within a few seconds.",
    criticalItem: true,
    visualTest: true,
    testType: "joint-attention",
    behavioralAreas: ["social-interaction", "eye-contact"],
  },
  {
    id: 2,
    question: "Have you ever wondered if your child might be deaf?",
    description: "Does your child respond when you call their name?",
    observationPrompt: "Think about different places like home, outdoors, or during play. When you say your child's name in a normal voice, do they usually turn or react?",
    criticalItem: true,
    reverseScored: true,
    behavioralAreas: ["response-to-name"],
  },
  {
    id: 3,
    question: "Does your child play pretend or make-believe?",
    description: "For example, pretend to drink from an empty cup, pretend to talk on a phone, or pretend to feed a doll?",
    observationPrompt: "Offer a toy cup, spoon, doll, or toy phone and watch whether your child uses it in an imaginative way without being shown first.",
    criticalItem: false,
    visualTest: true,
    testType: "pretend-play",
    behavioralAreas: ["social-interaction"],
  },
  {
    id: 4,
    question: "Does your child like climbing on things?",
    description: "For example, furniture, playground equipment, or stairs.",
    observationPrompt: "Think about everyday movement. Does your child naturally seek climbing or exploring on stairs, cushions, or playground structures?",
    criticalItem: false,
    behavioralAreas: [],
  },
  {
    id: 5,
    question: "Does your child make unusual finger movements near their eyes?",
    description: "For example, does your child wiggle their fingers close to their eyes?",
    observationPrompt: "Notice recent play or quiet time. Have you seen repeated finger flicking, staring through fingers, or similar movements near the eyes?",
    criticalItem: false,
    reverseScored: true,
    visualTest: true,
    testType: "finger-movement",
    behavioralAreas: ["repetitive-behavior", "eye-contact"],
  },
  {
    id: 6,
    question: "Does your child point with one finger to ask for something or to get help?",
    description: "For example, pointing to a snack or toy that is out of reach.",
    observationPrompt: "Place a favorite object where your child can see it but cannot reach it. Do they point with one finger to ask for help?",
    criticalItem: true,
    visualTest: true,
    testType: "pointing",
    behavioralAreas: ["social-interaction"],
  },
  {
    id: 7,
    question: "Does your child point with one finger to show you something interesting?",
    description: "For example, pointing to an airplane in the sky or a big truck in the road.",
    observationPrompt: "During walks or play, notice whether your child points just to share excitement with you, not only to ask for something.",
    criticalItem: true,
    visualTest: true,
    testType: "pointing-interest",
    behavioralAreas: ["social-interaction"],
  },
  {
    id: 8,
    question: "Is your child interested in other children?",
    description: "For example, does your child watch other children, smile at them, or go to them?",
    observationPrompt: "Think about parks, family gatherings, or daycare. Does your child notice other children and try to watch, approach, or join them?",
    criticalItem: false,
    behavioralAreas: ["social-interaction"],
  },
  {
    id: 9,
    question: "Does your child show you things by bringing them to you or holding them up for you to see?",
    description: "Not to get help, but just to share.",
    observationPrompt: "Notice whether your child brings you toys, drawings, or found objects simply to show you, even when they do not need assistance.",
    criticalItem: true,
    visualTest: true,
    testType: "showing",
    behavioralAreas: ["social-interaction"],
  },
  {
    id: 10,
    question: "Does your child respond when you call their name?",
    description: "For example, do they look up, talk or babble, or stop what they are doing when you call their name?",
    observationPrompt: "Try this when your child is busy but calm. When you call their name once or twice, do they usually stop, look up, or respond?",
    criticalItem: true,
    behavioralAreas: ["response-to-name"],
  },
  {
    id: 11,
    question: "When you smile at your child, do they smile back at you?",
    description: "Does your child return your smile?",
    observationPrompt: "During a calm face-to-face moment, smile warmly and notice whether your child smiles back or mirrors your expression.",
    criticalItem: false,
    visualTest: true,
    testType: "social-smile",
    behavioralAreas: ["social-interaction", "eye-contact"],
  },
  {
    id: 12,
    question: "Does your child get upset by everyday sounds?",
    description: "For example, vacuum cleaners or loud music.",
    observationPrompt: "Think about common sounds at home like mixers, flushing toilets, or music. Does your child react much more strongly than expected?",
    criticalItem: false,
    reverseScored: true,
    behavioralAreas: ["repetitive-behavior"],
  },
  {
    id: 13,
    question: "Does your child walk?",
    description: "Can your child walk independently?",
    observationPrompt: "Think about current movement skills. Can your child move around independently without needing support to walk?",
    criticalItem: false,
    behavioralAreas: [],
  },
  {
    id: 14,
    question: "Does your child look you in the eye when you are talking, playing, or dressing them?",
    description: "Does your child make eye contact during interactions?",
    observationPrompt: "During play, dressing, or snack time, notice whether your child makes brief comfortable eye contact as part of the interaction.",
    criticalItem: true,
    visualTest: true,
    testType: "eye-contact",
    behavioralAreas: ["eye-contact", "social-interaction"],
  },
  {
    id: 15,
    question: "Does your child try to copy what you do?",
    description: "For example, wave bye-bye, clap, or make a funny noise when you do.",
    observationPrompt: "Try a simple action like clapping, waving, or tapping the table and see whether your child copies you after watching.",
    criticalItem: false,
    visualTest: true,
    testType: "imitation",
    behavioralAreas: ["social-interaction"],
  },
  {
    id: 16,
    question: "If you turn your head to look at something, does your child look around to see what you are looking at?",
    description: "Does your child follow your gaze?",
    observationPrompt: "Look toward something interesting without pointing. Notice whether your child checks where you are looking.",
    criticalItem: true,
    visualTest: true,
    testType: "gaze-following",
    behavioralAreas: ["eye-contact", "social-interaction"],
  },
  {
    id: 17,
    question: "Does your child try to get you to watch them?",
    description: 'For example, does your child look at you for praise, or say "look" or "watch me"?',
    observationPrompt: "During play or movement, does your child try to pull your attention toward what they are doing to share the moment?",
    criticalItem: false,
    behavioralAreas: ["social-interaction"],
  },
  {
    id: 18,
    question: "Does your child understand when you tell them to do something?",
    description: 'For example, can your child understand "bring me the blanket" without pointing?',
    observationPrompt: "Give a simple familiar instruction without gestures and notice whether your child understands what you said.",
    criticalItem: false,
    behavioralAreas: ["response-to-name"],
  },
  {
    id: 19,
    question: "If something new happens, does your child look at your face to see how you feel about it?",
    description: "For example, if they hear a strange noise or see a new toy, do they look at your face?",
    observationPrompt: "During a small surprise or unfamiliar moment, notice whether your child checks your face before deciding how to react.",
    criticalItem: true,
    visualTest: true,
    testType: "social-referencing",
    behavioralAreas: ["social-interaction", "eye-contact"],
  },
  {
    id: 20,
    question: "Does your child like movement activities?",
    description: "For example, being swung or bounced on your knee.",
    observationPrompt: "Think about favorite activities. Does your child seem to enjoy swinging, bouncing, spinning, or similar movement play?",
    criticalItem: false,
    behavioralAreas: [],
  },
]

export const followUpQuestions: FollowUpQuestion[] = [
  {
    id: "fu-1",
    parentQuestionId: 1,
    prompt: "When you point to something interesting, does your child usually look within a few seconds?",
    behaviorArea: "social-interaction",
  },
  {
    id: "fu-2",
    parentQuestionId: 2,
    prompt: "When you say your child's name in a calm voice, do they usually turn or respond without extra prompts?",
    behaviorArea: "response-to-name",
  },
  {
    id: "fu-3",
    parentQuestionId: 5,
    prompt: "Have the unusual finger movements near the eyes happened more than once in the last month?",
    behaviorArea: "repetitive-behavior",
  },
  {
    id: "fu-4",
    parentQuestionId: 6,
    prompt: "When something is out of reach, does your child point rather than only cry or pull you there?",
    behaviorArea: "social-interaction",
  },
  {
    id: "fu-5",
    parentQuestionId: 7,
    prompt: "Does your child point to share excitement, even when they do not need help getting the object?",
    behaviorArea: "social-interaction",
  },
  {
    id: "fu-6",
    parentQuestionId: 10,
    prompt: "Across different places like home or outside, does your child respond to their name consistently?",
    behaviorArea: "response-to-name",
  },
  {
    id: "fu-7",
    parentQuestionId: 14,
    prompt: "During play, does your child make eye contact at least briefly several times?",
    behaviorArea: "eye-contact",
  },
  {
    id: "fu-8",
    parentQuestionId: 19,
    prompt: "When something unexpected happens, does your child check your face to see how you react?",
    behaviorArea: "social-interaction",
  },
]

export interface MChatComputation {
  score: number
  criticalFailed: number
  failedQuestionIds: number[]
  riskLevel: "low" | "medium" | "high"
  needsFollowUp: boolean
}

export function isQuestionFailed(question: MChatQuestion, answer: AnswerType) {
  return question.reverseScored ? answer === "yes" : answer === "no"
}

export function computeInitialMchatResult(answers: AnswerType[]): MChatComputation {
  let score = 0
  let criticalFailed = 0
  const failedQuestionIds: number[] = []

  mchatQuestions.forEach((question, index) => {
    if (isQuestionFailed(question, answers[index])) {
      score += 1
      failedQuestionIds.push(question.id)
      if (question.criticalItem) {
        criticalFailed += 1
      }
    }
  })

  let riskLevel: MChatComputation["riskLevel"] = "low"
  if (score >= 8) {
    riskLevel = "high"
  } else if (score >= 3) {
    riskLevel = "medium"
  }

  return {
    score,
    criticalFailed,
    failedQuestionIds,
    riskLevel,
    needsFollowUp: score >= 3,
  }
}

export function getRelevantFollowUpQuestions(failedQuestionIds: number[]) {
  const matched = followUpQuestions.filter((item) => failedQuestionIds.includes(item.parentQuestionId))
  return matched.length > 0 ? matched : followUpQuestions.slice(0, 4)
}

export function computeFollowUpRisk(
  followUpAnswers: Record<string, AnswerType>,
  selectedFollowUps: FollowUpQuestion[],
) {
  const failedFollowUps = selectedFollowUps.filter((item) => followUpAnswers[item.id] === "no")
  const score = failedFollowUps.length

  let riskLevel: "low" | "medium" | "high" = "low"
  if (score >= 4) {
    riskLevel = "high"
  } else if (score >= 2) {
    riskLevel = "medium"
  }

  return {
    score,
    riskLevel,
    failedFollowUps,
  }
}

export function buildBehavioralInsights(failedQuestionIds: number[]) {
  const areas = {
    "eye-contact": { label: "Eye contact", count: 0 },
    "social-interaction": { label: "Social interaction", count: 0 },
    "response-to-name": { label: "Response to name", count: 0 },
    "repetitive-behavior": { label: "Repetitive behavior", count: 0 },
  }

  mchatQuestions
    .filter((question) => failedQuestionIds.includes(question.id))
    .forEach((question) => {
      question.behavioralAreas.forEach((area) => {
        areas[area].count += 1
      })
    })

  return Object.entries(areas)
    .map(([key, value]) => ({ key, ...value }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
}

export function buildAiExplanation(riskLevel: "low" | "medium" | "high", childName: string, followUpUsed: boolean) {
  const name = childName || "your child"
  const followUpNote = followUpUsed
    ? " We also included follow-up questions to clarify the first screen."
    : ""

  if (riskLevel === "low") {
    return `${name}'s responses suggest a low level of concern on this screen.${followUpNote} This does not point strongly toward autism risk right now, but it is still a good idea to keep noticing communication, play, and social interaction over time.`
  }

  if (riskLevel === "medium") {
    return `${name}'s answers show some areas that would benefit from closer follow-up.${followUpNote} This means there are behaviors worth discussing with a pediatrician or developmental specialist, especially if you have noticed the same concerns in daily routines.`
  }

  return `${name}'s responses show several behaviors that deserve prompt professional follow-up.${followUpNote} This screen is not a diagnosis, but it does suggest that a specialist evaluation and early-support conversation would be helpful soon.`
}

export function buildNextSteps(riskLevel: "low" | "medium" | "high") {
  if (riskLevel === "low") {
    return [
      "Keep watching communication, play, and response-to-name during everyday routines.",
      "Retake the screen in 30 days or sooner if new concerns appear.",
      "Bring up any ongoing concerns at your next pediatric visit.",
    ]
  }

  if (riskLevel === "medium") {
    return [
      "Share these results with your pediatrician and ask whether a formal developmental follow-up is needed.",
      "Track the behaviors that raised concern over the next few weeks.",
      "Consider booking a specialist chat or appointment to review the report.",
    ]
  }

  return [
    "Arrange a developmental or autism-focused evaluation as soon as you can.",
    "Use the consultation flow below to send this report to a specialist.",
    "If you feel your child needs urgent behavioral or safety support, use the emergency help section right away.",
  ]
}

export function buildParentGuidance(riskLevel: "low" | "medium" | "high") {
  const common = [
    "Narrate play in short phrases and pause to invite eye contact or gestures.",
    "Use turn-taking games like rolling a ball, bubbles, or peek-a-boo.",
  ]

  if (riskLevel === "low") {
    return [...common, "Model pointing, waving, and sharing interest during daily routines."]
  }

  if (riskLevel === "medium") {
    return [
      ...common,
      "Practice name-response games with praise each time your child looks toward you.",
      "Use simple pretend-play activities like feeding a doll or driving a toy car together.",
    ]
  }

  return [
    ...common,
    "Reduce background noise and give one clear cue at a time when asking for eye contact or response.",
    "Repeat short social games every day and write down which situations are hardest, so you can share them with the doctor.",
  ]
}
