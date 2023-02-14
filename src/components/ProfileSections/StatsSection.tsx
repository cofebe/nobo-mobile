import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonItem,
  IonRow,
  IonCol,
  IonIcon,
  useIonActionSheet,
} from "@ionic/react";
import "./StatsSection.scss";
import { chevronDownOutline } from 'ionicons/icons';
import { AthleteProfile } from "../../data/athlete-detail";
import { getSportStats } from '../../helpers/StatsHelper';
import { normalizeSportGender } from '../../util';

interface StatsSectionProps {
  profile: AthleteProfile;
  className: string;
  myProfile: boolean;
  userId: number;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  profile,
  className,
  myProfile,
  userId,
}) => {
  const history = useHistory();

  const [emptyStats, setEmptyStats] = useState<boolean>(true);
  const [stats, setStats] = useState<any>({});
  const [sport, setSport] = useState<string>('football');
  const [sportCategories, setSportCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [presentActionSheet] = useIonActionSheet();

  useEffect(() => {
    //console.log('useEffect', profile);
    setSport(normalizeSportGender(profile.sport));
    //console.log('sport', normalizeSportGender(profile.sport));

    const statsMap: any = {};
    for (const season of (profile.stats || [])) {
      for (const category of season.categories) {
        if (!statsMap[category.category]) {
          statsMap[category.category] = [];
        }
        statsMap[category.category].push({
          season: season.season,
          values: category.values,
        });
      }
    }

    const keys = Object.keys(statsMap);
    for (const key of keys) {
      statsMap[key].sort((a: any, b: any) => {
        if (a.season < b.season) {
          return 1;
        } else if (a.season > b.season) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    //console.log('statsMap', statsMap, 'keys', keys);
    setStats(statsMap);
    setEmptyStats(keys.length === 0);

    const sportCategories = [];
    const sportStats = getSportStats(profile.sport);
    //console.log('profile.sport', profile.sport, 'sportStats', sportStats);
    for (const section of (sportStats?.sections || [])) {
      for (const category of section.categories) {
        if (statsMap[category.name]) {
          sportCategories.push(category.name);
        }
      }
    }
    setSportCategories(sportCategories);
    if (sportCategories.length > 0) {
      setCurrentCategory(sportCategories[0]);
    }
  }, [profile, myProfile, userId]);

  if (emptyStats) {
    if (myProfile) {
      return (
        <div className={"profile-stats-list " + className}>
          <div className="urp-highlight-add-media-container urp-highlight-add-media-container">
            <p className="urp-highlight-add-media-title">
              Uh! Looks like you haven’t added any stats to your account yet
            </p>
            <p
              className="urp-highlight-add-media-text"
              onClick={(e) => {
                e.preventDefault();
                history.push(`edit-athlete/${userId}`);
              }}
            >
              Add Stats
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className={"profile-stats-list " + className}>
          <div className="urp-highlight-add-media-container">
            <p className="urp-highlight-add-media-title">
              Uh! Looks like the user hasn't added any stats yet
            </p>
          </div>
        </div>
      );
    }
  }

  function selectCategory() {
    //console.log('selectCategory');
    presentActionSheet({
      header: 'Categories',
      buttons: sportCategories.map((cat: string) => {
        return {
          text: cat,
          data: {
            action: cat,
          },
        };
      }),
      onDidDismiss: ({ detail }) => {
        //console.log('onDidDismiss', detail);
        if (detail?.data?.action) {
          setCurrentCategory(detail.data.action);
        }
      },
    });
  }

  function format(v: any) {
    if (typeof v === 'string') {
      return v;
    }

    // Note that this handles our divide by zero errors
    if (isNaN(v)) {
      v = 0;
    }

    if (!v) {
      return '';
    }

    return v.toString();
  }

  function round(val: number, decPlaces: number, removeZero: boolean = false) {
    if (val === undefined || isNaN(val) || val === null || val === 0) {
      return '';
    }
    const v = val.toFixed(decPlaces);
    return (removeZero && v.startsWith('0.') ? v.substr(1) : v);
  }

  function orZero(v: any) {
    return v || 0;
  }

  let tableColumns: string[] = [];
  let tableRows: any[][] = [];
  switch (`${sport}:${currentCategory}`) {
    case 'football:Passing':
      tableColumns = [
        'Season',
        'GP',
        'C',
        'Att',
        'Yds',
        'C%',
        'Avg',
        'Y/G',
        'C/G',
        'TD',
        'TD/G',
        'Int',
        'Lng',
        'QB Rate',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.completions), // C
          orZero(s.values.attempts), // Att
          orZero(s.values.yards), // Yds
          round(orZero(s.values.completions) / orZero(s.values.attempts), 3, true), // C%
          round(orZero(s.values.yards) / orZero(s.values.completions), 1), // Avg
          round(orZero(s.values.yards) / orZero(s.values.gamesPlayed), 1), // Y/G
          round(orZero(s.values.completions) / orZero(s.values.gamesPlayed), 1), // C/G
          orZero(s.values.touchDowns), // TD
          round(orZero(s.values.touchDowns) / orZero(s.values.gamesPlayed), 1), // TD/G
          orZero(s.values.interceptions), // Int
          orZero(s.values.long), // Lng
          orZero(s.values.qbRating), // QB Rate
        ];
      });
      break;
    case 'football:Rushing':
      tableColumns = [
        'Season',
        'GP',
        'Car',
        'Yds',
        'Avg',
        'Y/G',
        'Lng',
        '100+',
        'TD',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.carries), // Car
          orZero(s.values.yards), // Yds
          round(orZero(s.values.yards) / orZero(s.values.carries), 1), // Avg
          round(orZero(s.values.yards) / orZero(s.values.gamesPlayed), 1), // Y/G
          orZero(s.values.long), // Lng
          orZero(s.values.over100), // 100+
          orZero(s.values.touchDowns), // TD
        ];
      });
      break;
    case 'football:Receiving':
      tableColumns = [
        'Season',
        'GP',
        'Rec',
        'Yds',
        'Avg',
        'Y/G',
        'Lng',
        'TD',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.receptions), // Rec
          orZero(s.values.yards), // Yds
          round(orZero(s.values.yards) / orZero(s.values.receptions), 1), // Avg
          round(orZero(s.values.yards) / orZero(s.values.gamesPlayed), 1), // Y/G
          orZero(s.values.long), // Lng
          orZero(s.values.touchDowns), // TD
        ];
      });
      break;
    case 'football:Fumbles and Pancake Blocks':
      tableColumns = [
        'Season',
        'GP',
        'Fum',
        'Lost',
        'Pnk Blk',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.fumbles), // Fum
          orZero(s.values.lost), // Lost
          orZero(s.values.pancakeBlocks), // Pnk Blk
        ];
      });
      break;
    case 'football:Tackles':
      tableColumns = [
        'Season',
        'GP',
        'Solo',
        'Asst',
        'Tot Tckls',
        'T/G',
        'TFL',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.solo), // Solo
          orZero(s.values.assists), // Asst
          orZero(s.values.solo) + orZero(s.values.assists), // Tot Tckls
          round((orZero(s.values.solo) + orZero(s.values.assists)) /
            orZero(s.values.gamesPlayed), 1), // T/G
          orZero(s.values.tacklesForLoss), // TFL
        ];
      });
      break;
    case 'football:Sacks':
      tableColumns = [
        'Season',
        'GP',
        'Sacks',
        'Ydl',
        'S/G',
        'Hurs',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.sacks), // Sacks
          orZero(s.values.yardsLost), // Ydl
          round(orZero(s.values.sacks) / orZero(s.values.gamesPlayed), 1), // S/G
          orZero(s.values.qbHurries), // Hari
        ];
      });
      break;
    case 'football:Kickoff and Punt Returns':
      tableColumns = [
        'Season',
        'GP',
        'KO Rets',
        'Yds',
        'Avg',
        'Lng',
        'P Rets',
        'Yds',
        'Avg',
        'Lng',
        'FC',
        'KR Yds',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.koReturns), // KO Rets
          orZero(s.values.koReturnYards), // Yds
          round(orZero(s.values.koReturnYards) / orZero(s.values.koReturns), 1), // Avg
          orZero(s.values.koLong), // Lng
          orZero(s.values.puntReturns), // P Rets
          orZero(s.values.puntReturnYards), // Yds
          round(orZero(s.values.puntReturnYards) / orZero(s.values.puntReturns), 1), // Avg
          orZero(s.values.puntLong), // Lng
          orZero(s.values.puntFairCatches), // FC
          orZero(s.values.koReturnYards) + orZero(s.values.puntReturnYards), // KR Yds
        ];
      });
      break;
    case 'baseball:Batting':
      tableColumns = [
        'Season',
        'GP',
        'Avg',
        'PA',
        'AB',
        'R',
        'H',
        'RBI',
        '2B',
        '3B',
        'HR',
        'GS',
        'SF',
        'SH/B',
        'BB',
        'K',
        'HBP',
        'ROE',
        'FC',
        'LOB',
        'OBP',
        'SLG',
        'OPS',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        const obp = (orZero(s.values.hits) + orZero(s.values.baseOnBalls) + orZero(s.values.hitByPitch)) /
          (orZero(s.values.atBats) + orZero(s.values.baseOnBalls) + orZero(s.values.hitByPitch) + orZero(s.values.sacrificeFly));
        const slg = (orZero(s.values.hits) + orZero(s.values.doubles) + orZero(s.values.triples)*2 + orZero(s.values.homeRuns)*3) /
          orZero(s.values.atBats);
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          round(orZero(s.values.hits) / orZero(s.values.atBats), 3, true), // Avg
          orZero(s.values.plateAppearances), // PA
          orZero(s.values.atBats), // AB
          orZero(s.values.runs), // R
          orZero(s.values.hits), // H
          orZero(s.values.rbi), // RBI
          orZero(s.values.doubles), // 2B
          orZero(s.values.triples), // 3B
          orZero(s.values.homeRuns), // HR
          orZero(s.values.grandSlams), // GS
          orZero(s.values.sacrificeFly), // SF
          orZero(s.values.sacrificeBunt), // SH/B
          orZero(s.values.baseOnBalls), // BB
          orZero(s.values.strikeOuts), // K
          orZero(s.values.hitByPitch), // HBP
          orZero(s.values.reachedOnError), // ROE
          orZero(s.values.fieldersChoice), // FC
          orZero(s.values.leftOnBase), // LOB
          round(obp, 3, true), // OBP
          round(slg, 3, true), // SLG
          round(obp + slg, 3, true), // OPS
        ];
      });
      break;
    case 'baseball:Baserunning':
      tableColumns = [
        'Season',
        'GP',
        'SB',
        'SBA',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.stolenBase), // SB
          orZero(s.values.stolenBaseAttempts), // SBA
        ];
      });
      break;
    case 'baseball:Fielding':
      tableColumns = [
        'Season',
        'GP',
        'FP',
        'TC',
        'PO',
        'A',
        'E',
        'DP',
        'TP',
        'PB',
        'SBA',
        'SB',
        'CS',
        'CS%',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          round((orZero(s.values.putOuts) + orZero(s.values.assists)) /
            orZero(s.values.totalChances), 3, true), // FP
          orZero(s.values.totalChances), // TC
          orZero(s.values.putOuts), // PO
          orZero(s.values.assists), // A
          orZero(s.values.errors), // E
          orZero(s.values.doublePlays), // DP
          orZero(s.values.triplePlays), // TP
          orZero(s.values.passedBalls), // PB
          orZero(s.values.stolenBaseAttemptsCatcher), // SBA
          orZero(s.values.stolenBaseCatcher), // SB
          orZero(s.values.caughtStealing), // CS
          orZero(s.values.caughtStealingPercentage), // CS%
        ];
      });
      break;
    case 'baseball:Pitching':
      tableColumns = [
        'Season',
        'ERA',
        'W',
        'L',
        'W%',
        'APP',
        'GS',
        'CG',
        'SO',
        'SV',
        'NH',
        'PG',
        'IP',
        'H',
        'R',
        'ER',
        'BB',
        'K',
        '2B',
        '3B',
        'HR',
        'BF',
        'AB',
        'OBA',
        'OBP',
        'WP',
        'HBP',
        'SF',
        'SH/B',
        '#P',
        'BK',
        'PO',
        'SB',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        const obp = (orZero(s.values.hitsAgainst) + orZero(s.values.baseOnBallsAgainst) + orZero(s.values.hitBatter)) /
          (orZero(s.values.atBatsPitcher) + orZero(s.values.baseOnBallsAgainst) + orZero(s.values.hitBatter) + orZero(s.values.sacrificeFlyAgainst));
        return [
          s.season, // Season
          round(orZero(s.values.earnedRuns) / orZero(s.values.inningsPitched), 2), // ERA
          orZero(s.values.wins), // W
          orZero(s.values.loses), // L
          round(orZero(s.values.wins) / (orZero(s.values.wins) + orZero(s.values.loses)), 3, true), // W%
          orZero(s.values.appearances), // APP
          orZero(s.values.gamesStarted), // GS
          orZero(s.values.completeGames), // CG
          orZero(s.values.shutOut), // SO
          orZero(s.values.save), // SV
          orZero(s.values.noHitter), // NH
          orZero(s.values.perfectGame), // PG
          orZero(s.values.inningsPitched), // IP
          orZero(s.values.hitsAgainst), // H
          orZero(s.values.runsAgainst), // R
          orZero(s.values.earnedRuns), // ER
          orZero(s.values.baseOnBallsAgainst), // BB
          orZero(s.values.battersStruckOut), // K
          orZero(s.values.doublesAgainst), // 2B
          orZero(s.values.triplesAgainst), // 3B
          orZero(s.values.homeRunsAgainst), // HR
          orZero(s.values.battersFaced), // BF
          orZero(s.values.atBatsPitcher), // AB
          round(orZero(s.values.hitsAgainst) / orZero(s.values.atBatsPitcher), 3, true), // OBA
          round(obp, 3, true), // OBP
          orZero(s.values.wildPitches), // WP
          orZero(s.values.hitBatter), // HBP
          orZero(s.values.sacrificeFlyAgainst), // SF
          orZero(s.values.sacrificeBuntAgainst), // SH/B
          orZero(s.values.numberOfPitches), // #P
          orZero(s.values.balks), // BK
          orZero(s.values.pickOffs), // PO
          orZero(s.values.stolenBasesPitcher), // SB
        ];
      });
      break;
    case 'basketball:Game Stats':
      tableColumns = [
        'Season',
        'GP',
        'MPG',
        'PPG',
        'DEFR',
        'OFFR',
        'RPG',
        'APG',
        'SPG',
        'BPG',
        'TPG',
        'PFPG',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          round(orZero(s.values.minutesPlayed) / orZero(s.values.gamesPlayed), 1), // MPG
          round(orZero(s.values.points) / orZero(s.values.gamesPlayed), 1), // PPG
          round(orZero(s.values.defensiveRebounds) / orZero(s.values.gamesPlayed), 1), // DEFR
          round(orZero(s.values.offensiveRebounds) / orZero(s.values.gamesPlayed), 1), // OFFR
          round((orZero(s.values.defensiveRebounds) + orZero(s.values.offensiveRebounds)) /
            orZero(s.values.gamesPlayed), 1), // RPG
          round(orZero(s.values.assists) / orZero(s.values.gamesPlayed), 1), // APG
          round(orZero(s.values.steals) / orZero(s.values.gamesPlayed), 1), // SPG
          round(orZero(s.values.blocks) / orZero(s.values.gamesPlayed), 1), // BPG
          round(orZero(s.values.turnovers) / orZero(s.values.gamesPlayed), 1), // TPG
          round(orZero(s.values.fouls) / orZero(s.values.gamesPlayed), 1), // PFPG
        ];
      });
      break;
    case 'basketball:Shooting':
      tableColumns = [
        'Season',
        'GP',
        'Min',
        'Pts',
        'FGM',
        'FGA',
        'FG%',
        'PPS',
        'AFG%',
        '3PM',
        '3PA',
        '3P%',
        '2FGM',
        '2FGA',
        '2FG%',
        'FTM',
        'FTA',
        'FT%',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        const points = orZero(s.values.threePointsMade) * 3 +
          orZero(s.values.twoPointsMade) * 2 +
          orZero(s.values.freeThrowsMade);
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.minutesPlayed), // Min
          orZero(points), // Pts
          orZero(s.values.threePointsMade) + orZero(s.values.twoPointsMade), // FGM
          orZero(s.values.threePointAttempts) + orZero(s.values.twoPointAttempts), // FGA
          round((orZero(s.values.threePointsMade) + orZero(s.values.twoPointsMade)) * 100.0 /
            (orZero(s.values.threePointAttempts) + orZero(s.values.twoPointAttempts)), 0), // FG%
          round(orZero(points) /
            (orZero(s.values.threePointAttempts) + orZero(s.values.twoPointAttempts)), 1), // PPS
          round((orZero(s.values.threePointsMade) + orZero(s.values.twoPointsMade) + orZero(s.values.threePointsMade)*0.5) * 100.0 /
            (orZero(s.values.threePointAttempts) + orZero(s.values.twoPointAttempts)), 0), // AFG%
          orZero(s.values.threePointsMade), // 3PM
          orZero(s.values.threePointAttempts), // 3PA
          round(orZero(s.values.threePointsMade) * 100.0 /
            orZero(s.values.threePointAttempts), 0), // 3P%
          orZero(s.values.twoPointsMade), // 2FGM
          orZero(s.values.twoPointAttempts), // 2FGA
          round(orZero(s.values.twoPointsMade) * 100.0 /
            orZero(s.values.twoPointAttempts), 0), // 2FG%
          orZero(s.values.freeThrowsMade), // FTM
          orZero(s.values.freeThrowAttempts), // FTA
          round(orZero(s.values.freeThrowsMade) * 100.0 /
            orZero(s.values.freeThrowAttempts), 0), // FT%
        ];
      });
      break;
    case 'volleyball:Attacking':
      tableColumns = [
        'Season',
        'SP',
        'K',
        'K/S',
        'Kill %',
        'Att',
        'E',
        'Hit %',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.setsPlayed), // SP
          orZero(s.values.kills), // K
          round(orZero(s.values.kills) / orZero(s.values.setsPlayed), 1), // K/S
          round(orZero(s.values.kills) / orZero(s.values.attackAttempts) * 100.0, 1), // Kill %
          orZero(s.values.attackAttempts), // Att
          orZero(s.values.attackErrors), // E
          round((orZero(s.values.kills) - orZero(s.values.attackErrors)) / orZero(s.values.attackAttempts), 3, true), // Hit %
        ];
      });
      break;
    case 'volleyball:Serving':
      tableColumns = [
        'Season',
        'SP',
        'A',
        'A/S',
        'Ace %',
        'SA',
        'SE',
        'Serv %',
        'PTS',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.setsPlayed), // SP
          orZero(s.values.servingAces), // A
          round(orZero(s.values.servingAces) / orZero(s.values.setsPlayed), 1), // A/S
          round(orZero(s.values.servingAces) * 100.0 / orZero(s.values.totalServes), 1), // Ace %
          orZero(s.values.totalServes), // SA
          orZero(s.values.servingErrors), // SE
          round((orZero(s.values.totalServes) - orZero(s.values.servingErrors)) * 100.0 / orZero(s.values.totalServes), 1), // Serv %
          orZero(s.values.servingPoints), // PTS
        ];
      });
      break;
    case 'volleyball:Blocking':
      tableColumns = [
        'Season',
        'SP',
        'BS',
        'BA',
        'Tot Blks',
        'B/S',
        'B/M',
        'BE',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.setsPlayed), // SP
          orZero(s.values.soloBlocks), // BS
          orZero(s.values.assistedBlocks), // BA
          orZero(s.values.soloBlocks) + orZero(s.values.assistedBlocks), // Tot Blks
          round((orZero(s.values.soloBlocks) + orZero(s.values.assistedBlocks)) / orZero(s.values.setsPlayed), 1), // B/S
          round((orZero(s.values.soloBlocks) + orZero(s.values.assistedBlocks)) / orZero(s.values.matchesPlayed), 1), // B/M
          orZero(s.values.blockErrors), // BE
        ];
      });
      break;
    case 'volleyball:Digging':
      tableColumns = [
        'Season',
        'SP',
        'D',
        'DE',
        'D/S',
        'D/M',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.setsPlayed), // SP
          orZero(s.values.digs), // D
          orZero(s.values.digErrors), // DE
          round(orZero(s.values.digs) / orZero(s.values.setsPlayed), 1), // D/S
          round(orZero(s.values.digs) / orZero(s.values.matchesPlayed), 1), // D/M
        ];
      });
      break;
    case 'volleyball:Ball Handling':
      tableColumns = [
        'Season',
        'SP',
        'Ast',
        'Ast/S',
        'BHA',
        'BHE',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.setsPlayed), // SP
          orZero(s.values.assists), // Ast
          round(orZero(s.values.assists) / orZero(s.values.setsPlayed), 1), // Ast/S
          orZero(s.values.ballHandlingAttempt), // BHA
          orZero(s.values.ballHandlingErrors), // BHE
        ];
      });
      break;
    case 'volleyball:Serve Receiving':
      tableColumns = [
        'Season',
        'SP',
        'R',
        'RE',
        'R/S',
        'R/M',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.setsPlayed), // SP
          orZero(s.values.receptions), // R
          orZero(s.values.receptionErrors), // RE
          round(orZero(s.values.receptions) / orZero(s.values.setsPlayed), 1), // R/S
          round(orZero(s.values.receptions) / orZero(s.values.matchesPlayed), 1), // R/M
        ];
      });
      break;
    case 'soccer:Field Stats':
      tableColumns = [
        'Season',
        'GP',
        'Min',
        'Goals',
        'G/G',
        'Asst',
        'Asst/G',
        'Pts',
        'P/G',
        'Stls',
        'CK',
        'Shots',
        'S/G',
        'SOG',
        'SOG/G',
        'SOG %',
        'PKG',
        'PKA',
        'GWG',
        'YC',
        'RC',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.fieldMinutes), // Min
          orZero(s.values.goals), // Goals
          round(orZero(s.values.goals) / orZero(s.values.gamesPlayed), 1), // G/G
          orZero(s.values.assists), // Asst
          round(orZero(s.values.assists) / orZero(s.values.gamesPlayed), 1), // Asst/G
          orZero(s.values.points), // Pts
          round(orZero(s.values.points) / orZero(s.values.gamesPlayed), 1), // P/G
          orZero(s.values.steals), // Stls
          orZero(s.values.cornerKicks), // CK
          orZero(s.values.shots), // Shots
          round(orZero(s.values.shots) / orZero(s.values.gamesPlayed), 1), // S/G
          orZero(s.values.shotsOnGoal), // SOG
          round(orZero(s.values.shotsOnGoal) / orZero(s.values.gamesPlayed), 1), // SOG/G
          round(orZero(s.values.shotsOnGoal) / orZero(s.values.shots), 1), // SOG %
          orZero(s.values.penaltyKicksMade), // PKG
          orZero(s.values.penaltyKickAttempts), // PKA
          orZero(s.values.gameWinningGoal), // GWG
          orZero(s.values.yellowCards), // YC
          orZero(s.values.redCards), // RC
        ];
      });
      break;
    case 'soccer:Goaltending':
      tableColumns = [
        'Season',
        'GP',
        'G. Min',
        'OT Min',
        'Opp SOG',
        'GA',
        'Saves',
        'S/G',
        'Save %',
        'GAA',
        'PK Saves',
        'PKA',
        'SO',
        'Win',
        'Loss',
        'Tie',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.gameMinutes), // G. Min
          orZero(s.values.otMinutes), // OT Min
          orZero(s.values.opponentShotsOnGoal), // Opp SOG
          orZero(s.values.goalsAgainst), // GA
          orZero(s.values.saves), // Saves
          round(orZero(s.values.saves) / orZero(s.values.gamesPlayed), 1), // S/G
          round(orZero(s.values.saves) / orZero(s.values.goalsAgainst), 3, true), // Save %
          round(orZero(s.values.goalsAgainstAverage), 3), // GAA
          orZero(s.values.penaltyKickSaves), // PK Saves
          orZero(s.values.penaltyKicksAgainst), // PKA
          orZero(s.values.shutOuts), // SO
          orZero(s.values.wins), // Win
          orZero(s.values.losses), // Loss
          orZero(s.values.ties), // Tie
        ];
      });
      break;
    case 'lacrosse:Scoring':
      tableColumns = [
        'Season',
        'GP',
        'G',
        'G/G',
        'Asst',
        'A/G',
        'Pts',
        'P/G',
        'TS',
        'SOG',
        'SHT%',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.goals), // G
          round(orZero(s.values.goals) / orZero(s.values.gamesPlayed), 1), // G/G
          orZero(s.values.assists), // Asst
          round(orZero(s.values.assists) / orZero(s.values.gamesPlayed), 1), // A/G
          orZero(s.values.points), // Pts
          round(orZero(s.values.points) / orZero(s.values.gamesPlayed), 1), // P/G
          orZero(s.values.totalShots), // TS
          orZero(s.values.shotsOnGoal), // SOG
          round(orZero(s.values.shotsOnGoal) / orZero(s.values.totalShots), 3, true), // SHT%
        ];
      });
      break;
    case 'lacrosse:Fielding':
      tableColumns = [
        'Season',
        'GP',
        'GB',
        'GB/G',
        'TO',
        'TA',
        'UE',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.groundBalls), // GB
          round(orZero(s.values.groundBalls) / orZero(s.values.gamesPlayed), 1), // GB/G
          orZero(s.values.turnovers), // TO
          orZero(s.values.takeaways), // TA
          orZero(s.values.unforcedErrors), // UE
        ];
      });
      break;
    case 'lacrosse:Faceoffs':
      tableColumns = [
        'Season',
        'GP',
        'FW',
        'FA',
        'FO%',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.gamesPlayed), // GP
          orZero(s.values.faceoffWins), // FW
          orZero(s.values.faceoffAttempts), // FA
          round(orZero(s.values.faceoffWins) / orZero(s.values.faceoffAttempts), 3, true), // FO%
        ];
      });
      break;
    case 'lacrosse:Goaltending':
      tableColumns = [
        'Season',
        'MIN',
        'GA',
        'GAA',
        'SOG',
        'SVs',
        'SV%',
        'SO',
        'W',
        'L',
        'T',
      ];
      tableRows = stats[currentCategory].map((s: any) => {
        return [
          s.season, // Season
          orZero(s.values.minutesPlayed), // MIN
          orZero(s.values.goalsAgainst), // GA
          round(orZero(s.values.goalsAgainstAverage), 1), // GAA
          orZero(s.values.keeperShotsOnGoal), // SOG
          orZero(s.values.saves), // SVs
          round(orZero(s.values.saves) / orZero(s.values.keeperShotsOnGoal), 3, true), // SV%
          orZero(s.values.shutOuts), // SO
          orZero(s.values.wins), // W
          orZero(s.values.losses), // L
          orZero(s.values.ties), // T
        ];
      });
      break;
    //case 'baseball:Batting':
    //  tableColumns = [
    //    'Season',
    //    'GP',
    //  ];
    //  tableRows = stats[currentCategory].map((s: any) => {
    //    return [
    //      s.season, // Season
    //      orZero(s.values.gamesPlayed), // GP
    //    ];
    //  });
    //  break;
  }

  return (
    <IonContent className="profile-stats-section" scrollY={true}>
      <IonItem className="stats-header" lines="none">
        <IonRow>
          <IonCol>
            <div className="stats-category-selection" onClick={(e) => {
              e.preventDefault();
              selectCategory();
            }}>
              <span>{currentCategory}</span>
              <IonIcon icon={chevronDownOutline} />
            </div>
          </IonCol>
        </IonRow>
      </IonItem>

      <IonItem lines="none" className="stats-table-item">
        {tableColumns.length ? (
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr className="stats-table-header">
                  {tableColumns.map((col: any, ci: number) => <th key={'h' + ci}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row: any, ri: number) => (
                  <tr key={ri}>
                    {row.map((col: any, ci: number) => <td key={`${ri}:${ci}`}>{format(col)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-table">No table defined for {sport}:{currentCategory}!</div>
        )}
        <div className="fade"></div>
      </IonItem>
    </IonContent>
  );
};

export default StatsSection;
