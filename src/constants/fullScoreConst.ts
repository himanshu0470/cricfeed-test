export const FULL_SCORE_COMPONENT = 'full-score';
export const TOURNAMENT_COMPONENT = "Schedule";
export const BALL_TYPE_OVER_COMPLETE = 0;
export const BALL_TYPE_REGULAR = 1;
export const BALL_TYPE_WIDE = 2; // WB
export const BALL_TYPE_BYE = 3; // BY
export const BALL_TYPE_LEG_BYE = 4; // LBY
export const BALL_TYPE_NO_BALL = 5; // NB
export const BALL_TYPE_NO_BALL_BYE = 6; // NBY
export const BALL_TYPE_NO_BALL_LEG_BYE = 7; // NLB
export const BALL_TYPE_PANELTY_RUN = 8;

export const OTHER_BALLS : { [key: number]: string } = {
    [BALL_TYPE_WIDE]: "WB",
    [BALL_TYPE_BYE]: "B",
    [BALL_TYPE_LEG_BYE]: "LB",
    [BALL_TYPE_NO_BALL]: "NB",
    [BALL_TYPE_NO_BALL_BYE]: "NBB",
    [BALL_TYPE_NO_BALL_LEG_BYE]: "NLB"
}
