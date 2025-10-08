use achievement::store::{Store, StoreTrait};
use achievement::types::task::{Task as AchievementTask, TaskTrait as AchievementTaskTrait};
use dojo::world::WorldStorage;

#[derive(Drop)]
pub struct Achievement {
    pub id: felt252, // Unique identifier for the achievement
    pub hidden: bool, // Hidden status of the achievement
    pub index: u8, // The page of the achievement in the group
    pub points: u16, // Weight of the achievement
    pub group: felt252, // Group name header to aggregate achievements
    pub icon: felt252, // https://fontawesome.com/search?o=r&s=solid
    pub title: felt252, // Title of the achievement
    pub description: ByteArray, // Description of the achievement (not the task itself)
    pub tasks: Span<AchievementTask> // Array of tasks to complete to unlock the achievement
}

pub mod Tasks {
    pub const BRAWLER_C: felt252 = 'BRAWLER_C';
    pub const BRAWLER_G: felt252 = 'BRAWLER_G';
    pub const COPS: felt252 = 'COPS';
    pub const DEALER: felt252 = 'DEALER';
    pub const ESCAPE: felt252 = 'ESCAPE';
    pub const FAMOUS: felt252 = 'FAMOUS';
    pub const GANGS: felt252 = 'GANGS';
    pub const HUSTLER: felt252 = 'HUSTLER';
    pub const JAILBIRD: felt252 = 'JAILBIRD';
    pub const KINGPIN: felt252 = 'KINGPIN';
    pub const LAUNDERER: felt252 = 'LAUNDERER';
    pub const RIP: felt252 = 'RIP';
    pub const STUFFED: felt252 = 'STUFFED';
}

#[generate_trait]
pub impl AchievementImpl of AchievementTrait {
    #[inline]
    fn declare(self: Achievement, mut world: WorldStorage) {
        let store: Store = StoreTrait::new(world);
        store
            .create(
                id: self.id,
                hidden: self.hidden,
                index: self.index,
                points: self.points,
                start: 0,
                end: 0,
                group: self.group,
                icon: self.icon,
                title: self.title,
                description: self.description.clone(),
                tasks: self.tasks,
                data: "",
            );
    }

    fn declare_all(mut world: WorldStorage) {
        let mut achievements: Array<Achievement> = array![
            Self::brawler(), Self::cops_1(), Self::cops_2(), Self::cops_3(), Self::dealer_1(),
            Self::dealer_2(), Self::dealer_3(), Self::escape_1(), Self::escape_2(),
            Self::escape_3(), Self::famous(), Self::gangs_1(), Self::gangs_2(), Self::gangs_3(),
            Self::hustler_1(), Self::hustler_2(), Self::hustler_3(), Self::jailbird_1(),
            Self::jailbird_2(), Self::jailbird_3(), Self::kingpin(), Self::launderer(), Self::rip(),
            Self::stuffed(),
        ];
        while let Option::Some(achievement) = achievements.pop_front() {
            achievement.declare(world);
        }
    }

    fn progress(world: WorldStorage, player_id: felt252, task_id: felt252, count: u32, time: u64) {
        let store: Store = StoreTrait::new(world);
        store.progress(player_id: player_id, task_id: task_id, count: count, time: time)
    }


    #[inline]
    fn brawler() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::BRAWLER_C, total: 1, description: "Defeat a max level Cop",
            ),
            AchievementTaskTrait::new(
                id: Tasks::BRAWLER_G, total: 1, description: "Defeat a max level Gang",
            ),
        ];
        Achievement {
            id: 'BRAWLER',
            hidden: false,
            index: 0,
            points: 80,
            group: 'Brawler',
            icon: 'fa-person-rifle',
            title: 'Brawler',
            description: "I am what I am. A fighter.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn cops_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(id: Tasks::COPS, total: 10, description: "Defeat 10 Cops"),
        ];
        Achievement {
            id: 'COPS_1',
            hidden: false,
            index: 0,
            points: 10,
            group: 'Encounters',
            icon: 'fa-user-police',
            title: 'Patrol Buster',
            description: "When the streets talk back, the law listens",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn cops_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(id: Tasks::COPS, total: 100, description: "Defeat 100 Cops"),
        ];
        Achievement {
            id: 'COPS_2',
            hidden: false,
            index: 1,
            points: 25,
            group: 'Encounters',
            icon: 'fa-siren',
            title: 'Precinct Nightmare',
            description: "When the streets talk back, the law listens",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn cops_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(id: Tasks::COPS, total: 500, description: "Defeat 500 Cops"),
        ];
        Achievement {
            id: 'COPS_3',
            hidden: false,
            index: 2,
            points: 50,
            group: 'Encounters',
            icon: 'fa-helicopter',
            title: 'Five-O Reaper',
            description: "When the streets talk back, the law listens",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn dealer_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::DEALER, total: 100, description: "Make 100 deals worth over a million",
            ),
        ];
        Achievement {
            id: 'DEALER_1',
            hidden: false,
            index: 0,
            points: 10,
            group: 'Dealer',
            icon: 'fa-tablets',
            title: 'Operator',
            description: "Only drug dealers and software companies call their customers 'users'",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn dealer_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::DEALER, total: 200, description: "Make 200 deals worth over a million",
            ),
        ];
        Achievement {
            id: 'DEALER_2',
            hidden: false,
            index: 1,
            points: 30,
            group: 'Dealer',
            icon: 'fa-capsules',
            title: 'Broker',
            description: "Only drug dealers and software companies call their customers 'users'",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn dealer_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::DEALER, total: 500, description: "Make 500 deals worth over a million",
            ),
        ];
        Achievement {
            id: 'DEALER_3',
            hidden: false,
            index: 2,
            points: 75,
            group: 'Dealer',
            icon: 'fa-bong',
            title: 'Cartel',
            description: "Only drug dealers and software companies call their customers 'users'",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn escape_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::ESCAPE, total: 10, description: "Escape Cops or Gangs 10 times",
            ),
        ];
        Achievement {
            id: 'ESCAPE_1',
            hidden: false,
            index: 0,
            points: 10,
            group: 'Escape',
            icon: 'fa-person-running-fast',
            title: 'Quickstep',
            description: "It's not outrunning them, it's outsmarting them.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn escape_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::ESCAPE, total: 20, description: "Escape Cops or Gangs 20 times",
            ),
        ];
        Achievement {
            id: 'ESCAPE_2',
            hidden: false,
            index: 1,
            points: 25,
            group: 'Escape',
            icon: 'fa-motorcycle',
            title: 'Shadow',
            description: "It's not outrunning them, it's outsmarting them.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn escape_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::ESCAPE, total: 50, description: "Escape Cops or Gangs 50 times",
            ),
        ];
        Achievement {
            id: 'ESCAPE_3',
            hidden: false,
            index: 2,
            points: 50,
            group: 'Escape',
            icon: 'fa-snake',
            title: 'Eel',
            description: "It's not outrunning them, it's outsmarting them.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn famous() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::FAMOUS, total: 1, description: "End a game with max reputation",
            ),
        ];
        Achievement {
            id: 'FAMOUS',
            hidden: false,
            index: 0,
            points: 80,
            group: 'Notorious',
            icon: 'fa-joint',
            title: 'Notorious',
            description: "The game is the game. Always.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn gangs_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(id: Tasks::GANGS, total: 10, description: "Defeat 10 Gangs"),
        ];
        Achievement {
            id: 'GANGS_1',
            hidden: false,
            index: 0,
            points: 10,
            group: 'Encounters',
            icon: 'fa-hand-back-fist',
            title: 'Turf Taker',
            description: "Your rep is your currency and every shot fired is an investment",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn gangs_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::GANGS, total: 100, description: "Defeat 100 Gangs",
            ),
        ];
        Achievement {
            id: 'GANGS_2',
            hidden: false,
            index: 1,
            points: 25,
            group: 'Encounters',
            icon: 'fa-knife-kitchen',
            title: 'Block Boss',
            description: "Your rep is your currency and every shot fired is an investment",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn gangs_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::GANGS, total: 500, description: "Defeat 500 Gangs",
            ),
        ];
        Achievement {
            id: 'GANGS_3',
            hidden: false,
            index: 2,
            points: 50,
            group: 'Encounters',
            icon: 'fa-gun',
            title: 'Syndicate Slayer',
            description: "Your rep is your currency and every shot fired is an investment",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn hustler_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::HUSTLER, total: 10, description: "Play 10 ranked games",
            ),
        ];
        Achievement {
            id: 'HUSTLER_1',
            hidden: false,
            index: 0,
            points: 20,
            group: 'Block Ambition',
            icon: 'fa-head-side-mask',
            title: 'Slinger',
            description: "It's not about becoming someone. It's about becoming someone they can't ignore",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn hustler_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::HUSTLER, total: 50, description: "Play 50 ranked games",
            ),
        ];
        Achievement {
            id: 'HUSTLER_2',
            hidden: false,
            index: 1,
            points: 50,
            group: 'Block Ambition',
            icon: 'fa-user-hoodie',
            title: 'Hustler',
            description: "It's not about becoming someone. It's about becoming someone they can't ignore",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn hustler_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::HUSTLER, total: 100, description: "Play 100 ranked games",
            ),
        ];
        Achievement {
            id: 'HUSTLER_3',
            hidden: false,
            index: 2,
            points: 75,
            group: 'Block Ambition',
            icon: 'fa-luchador-mask',
            title: 'OG',
            description: "It's not about becoming someone. It's about becoming someone they can't ignore",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn jailbird_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::JAILBIRD, total: 1, description: "Get jailed once",
            ),
        ];
        Achievement {
            id: 'JAILBIRD_1',
            hidden: true,
            index: 0,
            points: 10,
            group: 'Jailbird',
            icon: 'fa-hands-bound',
            title: 'Outlaw',
            description: "The walls have ears, and they've heard enough",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn jailbird_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::JAILBIRD, total: 3, description: "Get jailed 3 times",
            ),
        ];
        Achievement {
            id: 'JAILBIRD_2',
            hidden: true,
            index: 1,
            points: 25,
            group: 'Jailbird',
            icon: 'fa-handcuffs',
            title: 'Criminal',
            description: "The walls have ears, and they've heard enough",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn jailbird_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::JAILBIRD, total: 1, description: "Get jailed 10 times",
            ),
        ];
        Achievement {
            id: 'JAILBIRD_3',
            hidden: true,
            index: 2,
            points: 50,
            group: 'Jailbird',
            icon: 'fa-dungeon',
            title: 'Jailbird',
            description: "The walls have ears, and they've heard enough",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn kingpin() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::KINGPIN, total: 1, description: "Win a season of Dopewars",
            ),
        ];
        Achievement {
            id: 'KINGPIN',
            hidden: false,
            index: 0,
            points: 100,
            group: 'Domination',
            icon: 'fa-crown',
            title: 'Kingpin',
            description: "In the boss's domain, every decision is a command, every order, law.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn launderer() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::LAUNDERER,
                total: 1,
                description: "Launder the results at the end of a season.",
            ),
        ];
        Achievement {
            id: 'LAUNDERER',
            hidden: true,
            index: 0,
            points: 50,
            group: 'Launderer',
            icon: 'fa-washing-machine',
            title: 'The Cleaner',
            description: "Mixing the dirt with the dough",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn rip() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(id: Tasks::RIP, total: 1, description: "Die"),
        ];
        Achievement {
            id: 'RIP',
            hidden: true,
            index: 0,
            points: 10,
            group: 'Rip',
            icon: 'fa-skull-crossbones',
            title: 'Flatliner',
            description: "We all got a number, and it's not the one you dial",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn stuffed() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::STUFFED, total: 1, description: "Max out equipment",
            ),
        ];
        Achievement {
            id: 'STUFFED',
            hidden: true,
            index: 0,
            points: 80,
            group: 'Fully Loaded',
            icon: 'fa-user-ninja',
            title: 'Fully Loaded',
            description: "If they bring a knife to the fight, we bring a gun",
            tasks: tasks.span(),
        }
    }
}
