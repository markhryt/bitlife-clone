import type { GameEvent } from './types';

export const events: GameEvent[] = [
    /* ──────────── CHILDHOOD (0-12) ──────────── */
    {
        id: 'child_pet',
        title: 'Stray Puppy',
        description: 'A scruffy puppy follows you home from school. Your parents look unsure.',
        minAge: 4, maxAge: 12, weight: 3,
        choices: [
            { label: 'Beg to keep it', effects: { happiness: 10, karma: 5 } },
            { label: 'Let it go', effects: { karma: 8, happiness: -3 } },
        ],
    },
    {
        id: 'child_bully',
        title: 'Playground Trouble',
        description: 'An older kid shoves you during recess and demands your lunch money.',
        minAge: 5, maxAge: 12, weight: 3,
        choices: [
            { label: 'Stand your ground', effects: { karma: 5, health: -5, happiness: 5 } },
            { label: 'Hand it over', effects: { happiness: -8, cash: -2 } },
            { label: 'Tell a teacher', effects: { smarts: 3, karma: 3 } },
        ],
    },
    {
        id: 'child_talent',
        title: 'Hidden Talent',
        description: 'Your teacher notices you have a knack for music and suggests lessons.',
        minAge: 6, maxAge: 12, weight: 2,
        choices: [
            { label: 'Take lessons', effects: { smarts: 8, happiness: 5, cash: -10 } },
            { label: 'Not interested', effects: { happiness: -2 } },
        ],
    },
    {
        id: 'child_library',
        title: 'Library Discovery',
        description: 'You stumble across a fascinating book about space exploration.',
        minAge: 5, maxAge: 12, weight: 3,
        choices: [
            { label: 'Read it cover to cover', effects: { smarts: 10, happiness: 4 } },
            { label: 'Look at the pictures', effects: { happiness: 3, smarts: 2 } },
        ],
    },
    {
        id: 'child_fall',
        title: 'Tree Climbing',
        description: 'You find the tallest tree in the park. The top branch looks amazing.',
        minAge: 4, maxAge: 11, weight: 2,
        choices: [
            { label: 'Climb to the top!', effects: { health: -8, happiness: 12, looks: -2 } },
            { label: 'Stay on the ground', effects: { happiness: -3 } },
        ],
    },
    {
        id: 'child_friend',
        title: 'New Kid in Class',
        description: 'A new student joins your class and sits alone at lunch.',
        minAge: 5, maxAge: 12, weight: 3,
        choices: [
            { label: 'Invite them over', effects: { happiness: 8, karma: 6 } },
            { label: 'Mind your business', effects: { karma: -3 } },
        ],
    },

    /* ──────────── TEEN (13-17) ──────────── */
    {
        id: 'teen_party',
        title: 'House Party',
        description: 'Your classmate is throwing a party while their parents are away.',
        minAge: 13, maxAge: 17, weight: 3,
        choices: [
            { label: 'Go and have fun', effects: { happiness: 12, health: -5, karma: -3 } },
            { label: 'Stay home and study', effects: { smarts: 8, happiness: -3 } },
            { label: 'Go but leave early', effects: { happiness: 4, smarts: 2 } },
        ],
    },
    {
        id: 'teen_exam',
        title: 'Big Exam',
        description: 'A crucial exam is tomorrow. You barely studied but a friend offers you a cheat sheet.',
        minAge: 14, maxAge: 17, weight: 3,
        choices: [
            { label: 'Use the cheat sheet', effects: { smarts: -5, karma: -10, happiness: 3 } },
            { label: 'Study all night', effects: { smarts: 10, health: -3, happiness: -2 } },
            { label: 'Wing it', effects: { smarts: -3, happiness: -5 } },
        ],
    },
    {
        id: 'teen_crush',
        title: 'First Crush',
        description: 'Someone in your class has caught your eye. Your heart races every time they walk by.',
        minAge: 13, maxAge: 17, weight: 2,
        choices: [
            { label: 'Ask them out', effects: { happiness: 15, looks: 3 } },
            { label: 'Admire from afar', effects: { happiness: -4 } },
        ],
    },
    {
        id: 'teen_job',
        title: 'Part-time Job Offer',
        description: 'The local café is hiring after school and weekends.',
        minAge: 14, maxAge: 17, weight: 3,
        choices: [
            { label: 'Take the job', effects: { cash: 50, happiness: -3, smarts: 2 } },
            { label: 'Focus on school', effects: { smarts: 5 } },
        ],
    },
    {
        id: 'teen_sport',
        title: 'Sports Try-outs',
        description: 'The varsity team is holding open try-outs. The coach looks tough.',
        minAge: 13, maxAge: 17, weight: 2,
        choices: [
            { label: 'Try out', effects: { health: 8, looks: 4, happiness: 5 } },
            { label: 'Not your thing', effects: { happiness: -2 } },
        ],
    },
    {
        id: 'teen_rebel',
        title: 'Rebellious Phase',
        description: 'You feel restless. A group of older kids invites you to tag along for some "fun."',
        minAge: 14, maxAge: 17, weight: 2,
        choices: [
            { label: 'Join them', effects: { happiness: 8, karma: -12, health: -5 } },
            { label: 'Decline politely', effects: { karma: 5, happiness: -2 } },
        ],
    },

    /* ──────────── ADULT (18-59) ──────────── */
    {
        id: 'adult_college',
        title: 'College Decision',
        description: 'You received a college acceptance letter. Tuition is steep though.',
        minAge: 18, maxAge: 22, weight: 4,
        choices: [
            { label: 'Enroll (take loans)', effects: { smarts: 15, cash: -200, happiness: 5 } },
            { label: 'Skip college, start working', effects: { cash: 100, smarts: -3 } },
        ],
    },
    {
        id: 'adult_promotion',
        title: 'Promotion Opportunity',
        description: 'Your boss hints a promotion is available, but it means longer hours.',
        minAge: 22, maxAge: 55, weight: 3,
        choices: [
            { label: 'Go for it', effects: { cash: 150, health: -5, happiness: -3 } },
            { label: 'Maintain work-life balance', effects: { happiness: 8, health: 3 } },
        ],
    },
    {
        id: 'adult_lottery',
        title: 'Found a Lottery Ticket',
        description: 'You find a discarded lottery ticket on the ground. It has today\'s date on it.',
        minAge: 18, maxAge: 70, weight: 1,
        choices: [
            { label: 'Check the numbers', effects: { cash: 500, happiness: 15 } },
            { label: 'Toss it', effects: {} },
        ],
    },
    {
        id: 'adult_invest',
        title: 'Investment Tip',
        description: 'A coworker whispers about a "sure thing" investment opportunity.',
        minAge: 22, maxAge: 59, weight: 2,
        choices: [
            { label: 'Invest heavily', effects: { cash: -100, smarts: 3 } },
            { label: 'Play it safe', effects: { karma: 3, happiness: 2 } },
            { label: 'Report to management', effects: { karma: 8, happiness: -2 } },
        ],
    },
    {
        id: 'adult_health_scare',
        title: 'Health Scare',
        description: 'A routine checkup reveals something concerning. The doctor wants more tests.',
        minAge: 30, maxAge: 59, weight: 2,
        choices: [
            { label: 'Get tested immediately', effects: { health: 5, cash: -80, happiness: -5 } },
            { label: 'Ignore it for now', effects: { health: -15, happiness: 3 } },
        ],
    },
    {
        id: 'adult_volunteer',
        title: 'Volunteer Opportunity',
        description: 'A local shelter is desperately seeking weekend volunteers.',
        minAge: 18, maxAge: 59, weight: 2,
        choices: [
            { label: 'Sign up', effects: { karma: 12, happiness: 8, health: 2 } },
            { label: 'Too busy right now', effects: { karma: -3 } },
        ],
    },

    /* ──────────── ELDER (60+) ──────────── */
    {
        id: 'elder_legacy',
        title: 'Writing Memoirs',
        description: 'A publisher approaches you about writing your life story.',
        minAge: 60, maxAge: 100, weight: 3,
        choices: [
            { label: 'Write the book', effects: { happiness: 15, smarts: 5, cash: 200 } },
            { label: 'Some things are private', effects: { karma: 5, happiness: 3 } },
        ],
    },
    {
        id: 'elder_grandchild',
        title: 'A New Generation',
        description: 'A young family member looks up to you and wants to hear your stories.',
        minAge: 60, maxAge: 100, weight: 3,
        choices: [
            { label: 'Share your wisdom', effects: { happiness: 12, karma: 8 } },
            { label: 'Give them money instead', effects: { cash: -50, happiness: 5, karma: 3 } },
        ],
    },

    /* ──────────── EXTRA EVENTS ──────────── */
    {
        id: 'any_travel',
        title: 'Travel Opportunity',
        description: 'You have a chance to travel somewhere new and exciting.',
        minAge: 18, maxAge: 75, weight: 2,
        choices: [
            { label: 'Book the trip!', effects: { happiness: 15, cash: -120, looks: 2 } },
            { label: 'Save the money', effects: { cash: 30, happiness: -3 } },
        ],
    },
    {
        id: 'any_charity',
        title: 'Charity Drive',
        description: 'A local charity is raising funds for a good cause.',
        minAge: 10, maxAge: 80, weight: 2,
        choices: [
            { label: 'Donate generously', effects: { cash: -60, karma: 15, happiness: 8 } },
            { label: 'Donate a little', effects: { cash: -10, karma: 5, happiness: 3 } },
            { label: 'Walk past', effects: { karma: -5 } },
        ],
    },
    {
        id: 'any_accident',
        title: 'Minor Accident',
        description: 'You slip on a wet floor and take a nasty fall.',
        minAge: 5, maxAge: 90, weight: 2,
        choices: [
            { label: 'Go to the hospital', effects: { health: 5, cash: -40, happiness: -3 } },
            { label: 'Walk it off', effects: { health: -10, happiness: -2 } },
        ],
    },
    {
        id: 'any_stranger',
        title: 'Stranger\'s Kindness',
        description: 'A stranger notices you looking down and offers some encouraging words.',
        minAge: 8, maxAge: 90, weight: 2,
        choices: [
            { label: 'Thank them warmly', effects: { happiness: 8, karma: 5 } },
            { label: 'Nod and move on', effects: { happiness: 2 } },
        ],
    },
];
