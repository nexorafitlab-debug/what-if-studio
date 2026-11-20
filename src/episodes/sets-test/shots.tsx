import React from 'react';
import {
  LivingRoom, Workshop, Hospital, Cafe, Bus, Airplane, Cinema, Bowling,
  Park, Street, Stadium, Fairground, RainyStreet, Bathroom, Calendar, ShotProps,
} from '../../engine';

// One shot per new set, set alone, no characters — for verifying each set reads as a distinct dressed place.
export const S1: React.FC<ShotProps> = ({ t }) => <LivingRoom t={t} />;
export const S2: React.FC<ShotProps> = ({ t }) => <Workshop t={t} />;
export const S3: React.FC<ShotProps> = ({ t }) => <Hospital t={t} />;
export const S4: React.FC<ShotProps> = ({ t }) => <Hospital t={t} grey />;
export const S5: React.FC<ShotProps> = ({ t }) => <Cafe t={t} />;
export const S6: React.FC<ShotProps> = ({ t }) => <Bus t={t} />;
export const S7: React.FC<ShotProps> = ({ t }) => <Airplane t={t} />;
export const S8: React.FC<ShotProps> = ({ t }) => <Cinema t={t} />;
export const S9: React.FC<ShotProps> = ({ t }) => <Bowling t={t} />;
export const S10: React.FC<ShotProps> = ({ t }) => <Park t={t} />;
export const S11: React.FC<ShotProps> = ({ t }) => <Street t={t} />;
export const S12: React.FC<ShotProps> = ({ t }) => <Stadium t={t} />;
export const S13: React.FC<ShotProps> = ({ t }) => <Fairground t={t} />;
export const S14: React.FC<ShotProps> = ({ t }) => <RainyStreet t={t} />;
export const S15: React.FC<ShotProps> = () => <Bathroom />;
export const S16: React.FC<ShotProps> = ({ t }) => <Calendar t={t} />;
