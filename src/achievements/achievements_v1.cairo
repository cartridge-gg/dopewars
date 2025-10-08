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
    pub const FAMOUS: felt252 = 'FAMOUS';
    pub const KINGPIN: felt252 = 'KINGPIN';
    pub const STUFFED: felt252 = 'STUFFED';
    pub const BUY_LOW: felt252 = 'BUY_LOW';
    pub const SELL_HIGH: felt252 = 'SELL_HIGH';
    pub const VOLUME: felt252 = 'VOLUME';
    pub const HIGH_STAKES: felt252 = 'HIGH_STAKES';
    pub const PAPER: felt252 = 'PAPER';
    pub const GEAR_FROM: felt252 = 'GEAR_FROM';
    pub const SURVIVOR: felt252 = 'SURVIVOR';
    pub const ENCOUNTER: felt252 = 'ENCOUNTER';
    pub const ELEGANT: felt252 = 'ELEGANT';
    pub const FULL_EARLY: felt252 = 'FULL_EARLY';
    pub const FULL_MID: felt252 = 'FULL_MID';
    pub const FULL_LATE: felt252 = 'FULL_LATE';
    pub const OG: felt252 = 'OG';
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
            Self::brawler(), Self::famous(), Self::kingpin(), Self::stuffed(), Self::blsh_1(),
            Self::blsh_2(), Self::blsh_3(), Self::volume_1(), Self::volume_2(), Self::volume_3(),
            Self::highstakes_1(), Self::highstakes_2(), Self::highstakes_3(), Self::paper_1(),
            Self::paper_2(), Self::paper_3(), Self::gear_from(), Self::survivor(),
            Self::encounters_1(), Self::encounters_2(), Self::encounters_3(), Self::elegant(),
            Self::full_early(), Self::full_mid(), Self::full_late(), Self::og(),
        ];
        while let Option::Some(achievement) = achievements.pop_front() {
            achievement.declare(world);
        }
    }

    fn progress(world: WorldStorage, player_id: felt252, task_id: felt252, count: u128, time: u64) {
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
            points: 50,
            group: 'Notorious',
            icon: 'fa-joint',
            title: 'Notorious',
            description: "The game is the game. Always.",
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
            points: 80,
            group: 'Domination',
            icon: 'fa-crown',
            title: 'Kingpin',
            description: "In the boss's domain, every decision is a command, every order, law.",
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
            points: 50,
            group: 'Fully Loaded',
            icon: 'fa-user-ninja',
            title: 'Fully Loaded',
            description: "If they bring a knife to the fight, we bring a gun",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn blsh_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::BUY_LOW, total: 20, description: "Buy drugs at the lowest price (20)",
            ),
            AchievementTaskTrait::new(
                id: Tasks::SELL_HIGH,
                total: 20,
                description: "Sell drugs at the highest price (20)",
            ),
        ];
        Achievement {
            id: 'BLSH_1',
            hidden: false,
            index: 0,
            points: 10,
            group: 'Discipline',
            icon: 'fa-slot-machine',
            title: 'Luck',
            description: "Patience is profit.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn blsh_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::BUY_LOW, total: 100, description: "Buy drugs at the lowest price (100)",
            ),
            AchievementTaskTrait::new(
                id: Tasks::SELL_HIGH,
                total: 100,
                description: "Sell drugs at the highest price (100)",
            ),
        ];
        Achievement {
            id: 'BLSH_2',
            hidden: false,
            index: 1,
            points: 30,
            group: 'Discipline',
            icon: 'fa-cards',
            title: 'Skill',
            description: "Buy when it's dirt cheap, sell when it's sky-high.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn blsh_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::BUY_LOW, total: 250, description: "Buy drugs at the lowest price (250)",
            ),
            AchievementTaskTrait::new(
                id: Tasks::SELL_HIGH,
                total: 250,
                description: "Sell drugs at the highest price( 250)",
            ),
        ];
        Achievement {
            id: 'BLSH_3',
            hidden: false,
            index: 2,
            points: 80,
            group: 'Discipline',
            icon: 'fa-pool-8-ball',
            title: 'Habit',
            description: "The market is a device for transferring money from the impatient to the patient.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn volume_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::VOLUME, total: 69000000, description: "Sell drugs for 69 Millions",
            ),
        ];
        Achievement {
            id: 'VOLUME_1',
            hidden: false,
            index: 0,
            points: 10,
            group: 'Dealer',
            icon: 'fa-tablets',
            title: 'Operator',
            description: "Grind small, stack big.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn volume_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::VOLUME, total: 420000000, description: "Sell drugs for 420 Millions",
            ),
        ];
        Achievement {
            id: 'VOLUME_2',
            hidden: false,
            index: 1,
            points: 30,
            group: 'Dealer',
            icon: 'fa-capsules',
            title: 'Broker',
            description: "Diversify your hustle. ",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn volume_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::VOLUME, total: 69000000000, description: "Sell drugs for 69 Billions",
            ),
        ];
        Achievement {
            id: 'VOLUME_3',
            hidden: false,
            index: 2,
            points: 75,
            group: 'Dealer',
            icon: 'fa-bong',
            title: 'Cartel',
            description: "Slow money beats no money. ",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn highstakes_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::HIGH_STAKES,
                total: 5,
                description: "Play 5 games with max stake multiplier",
            ),
        ];
        Achievement {
            id: 'HIGHSTAKES_1',
            hidden: false,
            index: 0,
            points: 10,
            group: 'Gambler',
            icon: 'fa-dice-d6',
            title: 'Roller',
            description: "Vet every deal like it's a setup.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn highstakes_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::HIGH_STAKES,
                total: 25,
                description: "Play 25 games with max stake multiplier",
            ),
        ];
        Achievement {
            id: 'HIGHSTAKES_2',
            hidden: false,
            index: 1,
            points: 30,
            group: 'Gambler',
            icon: 'fa-dice-d8',
            title: 'Staker',
            description: "Take what's yours fast.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn highstakes_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::HIGH_STAKES,
                total: 100,
                description: "Play 100 games with max stake multiplier",
            ),
        ];
        Achievement {
            id: 'HIGHSTAKES_3',
            hidden: false,
            index: 2,
            points: 80,
            group: 'Gambler',
            icon: 'fa-dice-d20',
            title: 'Dicer',
            description: "Sober up, read the room, then bet on what's steady.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn paper_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::PAPER, total: 69000, description: "Claim 69.000 $PAPER",
            ),
        ];
        Achievement {
            id: 'PAPER_1',
            hidden: false,
            index: 0,
            points: 10,
            group: 'Launderer',
            icon: 'fa-coin-vertical',
            title: 'Receipts',
            description: "Run numbers like it's a wiretap. ",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn paper_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::PAPER, total: 420000, description: "Claim 420.000 $PAPER",
            ),
        ];
        Achievement {
            id: 'PAPER_2',
            hidden: false,
            index: 1,
            points: 30,
            group: 'Launderer',
            icon: 'fa-money-bill-simple-wave',
            title: 'Funds',
            description: "Stay liquid, stay free. ",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn paper_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::PAPER, total: 1000000, description: "Claim 1.000.000 $PAPER",
            ),
        ];
        Achievement {
            id: 'PAPER_3',
            hidden: false,
            index: 2,
            points: 80,
            group: 'Launderer',
            icon: 'fa-sack-dollar',
            title: 'Nest Egg',
            description: "Follow the paper trail. Big players leave big clues.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn gear_from() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::GEAR_FROM,
                total: 1,
                description: "Play a game with a set of items from XXX",
            ),
        ];
        Achievement {
            id: 'GEAR_FROM',
            hidden: true,
            index: 0,
            points: 25,
            group: 'Drip',
            icon: 'fa-clothes-hanger',
            title: 'Drip',
            description: "Always remind where you come from.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn survivor() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::SURVIVOR, total: 1, description: "End a game with 1hp",
            ),
        ];
        Achievement {
            id: 'SURVIVOR',
            hidden: true,
            index: 0,
            points: 10,
            group: 'Survivor',
            icon: 'fa-shield-heart',
            title: 'Survivor',
            description: "Gear up right before you step to the table. ",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn encounters_1() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::ENCOUNTER, total: 100, description: "Defeat 100 Cops or Gangs",
            ),
        ];
        Achievement {
            id: 'ENCOUNTERS_1',
            hidden: false,
            index: 0,
            points: 10,
            group: 'Encounters',
            icon: 'fa-scalpel',
            title: 'Tough',
            description: "Know your exit before you step in.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn encounters_2() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::ENCOUNTER, total: 500, description: "Defeat 500 Cops or Gangs",
            ),
        ];
        Achievement {
            id: 'ENCOUNTERS_2',
            hidden: false,
            index: 1,
            points: 30,
            group: 'Encounters',
            icon: 'fa-knife-kitchen',
            title: 'Dangerous',
            description: "Solid cover's your best friend when bullets fly. ",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn encounters_3() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::ENCOUNTER, total: 1000, description: "Defeat 1000 Cops or Gangs",
            ),
        ];
        Achievement {
            id: 'ENCOUNTERS_3',
            hidden: false,
            index: 2,
            points: 80,
            group: 'Encounters',
            icon: 'fa-gun',
            title: 'Infamous',
            description: "Make your name a ghost story.  ",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn elegant() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::ELEGANT, total: 1, description: "Start a game with an accessory",
            ),
        ];
        Achievement {
            id: 'ELEGANT',
            hidden: true,
            index: 0,
            points: 25,
            group: 'Elegant',
            icon: 'fa-hockey-mask',
            title: 'Elegant',
            description: "Charm's your blade, style's your shield.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn full_early() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::FULL_EARLY, total: 5, description: "Play 5 games with full early items",
            ),
        ];
        Achievement {
            id: 'FULL_EARLY',
            hidden: true,
            index: 0,
            points: 20,
            group: 'Strategist',
            icon: 'fa-shirt-tank-top',
            title: 'Quick',
            description: "Dress sharp, move cold.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn full_mid() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::FULL_MID, total: 5, description: "Play 5 games with full mid items",
            ),
        ];
        Achievement {
            id: 'FULL_MID',
            hidden: true,
            index: 1,
            points: 20,
            group: 'Strategist',
            icon: 'fa-shirt',
            title: 'Versatile',
            description: "Drip don't shout, it whispers death.   ",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn full_late() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::FULL_LATE, total: 5, description: "Play 5 games with full late items",
            ),
        ];
        Achievement {
            id: 'FULL_LATE',
            hidden: true,
            index: 2,
            points: 20,
            group: 'Strategist',
            icon: 'fa-shirt-long-sleeve',
            title: 'Sturdy',
            description: "Roll deep, look lethal.",
            tasks: tasks.span(),
        }
    }


    #[inline]
    fn og() -> Achievement {
        let tasks: Array<AchievementTask> = array![
            AchievementTaskTrait::new(
                id: Tasks::OG, total: 1, description: "Play a game with an OG",
            ),
        ];
        Achievement {
            id: 'OG',
            hidden: true,
            index: 0,
            points: 25,
            group: 'OG',
            icon: 'fa-luchador-mask',
            title: 'Original Gangsta',
            description: "An OG owns the game forever. ",
            tasks: tasks.span(),
        }
    }
}
