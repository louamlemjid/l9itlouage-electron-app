import React from 'react';
import CostumCityDropDown from './CostumCityDropDown';

const CityDropdown = () => {
  const customOptions = [
    'Agareb', 'Ajim', 'Akouda', 'Aousdja', 'Ar Rudayyif', 'Ariana', 'As Sars', 'Aïne Draham', 'Bekalta', 'Ben Arous', 'Ben Gardane', 'Beni Hassane', 'Beni Khalled', 'Beni Kheddache', 'Beni Khiar', 'Bennane', 'Bir Ali Ben Khalifa', 'Bir el Hafey', 'Bizerte', 'Bodeur', 'Borj Mejen Bel Abbès', 'Bou Arada', 'Bou Arkoub', 'Bou Merdès', 'Bou Salem', 'Béja', 'Carthage', 'Chebba', 'Chorbane', 'Dahmani', 'Dar Chabanne', 'Degache', 'Dehiba', 'Djebeniana', 'Djemmal', 'Douz', 'El Alia', 'El Aroussa', 'El Battan', 'El Guetar', 'El Hamma', 'El Haouaria', 'El Jem', 'El Kef', 'El Ksar', 'El Ksour', 'El Maamoura', 'El Maknassi', 'El Metline', 'El Mida', 'Enfida', 'Er Regueb', 'Es Somaa', 'Ez Zahra', 'Feriana', 'Fernana', 'Fouchana', 'Gabès', 'Gafour', 'Galaat el Andeless', 'Ghardimaou', 'Ghomrassen', 'Ghraiba', 'Goubellat', 'Grombalia', 'Haffouz', 'Hajeb el Aïoun', 'Hammam Sousse', 'Hammam el Rhezez', 'Hammam-Lif', 'Hammamet', 'Harqalah', 'Haïdra', 'Hencha', 'Houmt Souk', 'Jedeïda', 'Jemna', 'JendoubaGafsa', 'Jerissa', 'Jilma', 'KairouanMétouia', 'Kalaa Srira', 'Kasserine', 'Kebili', 'Kelaa Kebira','kelibia', 'Khledia', 'Khunays', 'Korba', 'Korbous', 'Ksar Hellal', 'Ksibet el Mediouni', 'Ksour Essaf', 'Kélibia', 'La Goulette', 'La Marsa', 'La Mornaghia', 'Le Bardo', 'Le Kram', 'Lemta', 'Mahdia', 'Mahires', 'Maktar', 'Manouba', 'Mareth', 'Mateur', 'Medenine', 'Medjez el Bab', 'Melloulèche', 'Mennzel Bou Zelfa', 'Menzel Abderhaman', 'Menzel Bourguiba', 'Menzel Heurr', 'Menzel Kamel', 'Menzel Temime', 'Mesdour', 'Messadine', 'Metlaoui', 'Mezzouna', 'Midoun', 'Moknine', 'Monastir', 'Moularès', 'Msaken', 'Mégrine', 'M’dhilla', 'Nabeul', 'Nefta', 'Nibbar', 'Ouardenine', 'Oued Lill', 'Ousseltia', 'Radès', 'Rass el Djebel', 'Rejiche', 'Remada', 'Rhar el Melah', 'Rhennouch', 'Rohia', 'Sakiet Sidi Youssef', 'Sakiet ed Daier', 'Sakiet ez Zit', 'Salakta', 'Sbeitla', 'Sbiba', 'Sbikha', 'Sejenane', 'Seïada', 'Sfax', 'Sidi Alouane', 'Sidi Ben Nour', 'Sidi Bou Ali', 'Sidi Bou Rouis', 'Sidi Bou Saïd', 'Sidi Bouzid', 'Sidi Tabet', 'Sidi el Hani', 'Siliana', 'Skhira', 'Soliman', 'Souassi', 'Sousse', 'Sukrah', 'Tabarka', 'Tabursuq', 'Tajerouine', 'Takelsa', 'Tataouine', 'Tazarka', 'Teboulba', 'Tebourba', 'Testour', 'Thala', 'Thelepte', 'Tinja', 'Tourki', 'Touza', 'Tozeur', 'Tunis', 'Wadhraf', 'Zaghouan', 'Zaouiat Djedidi', 'Zaouiet Kountech', 'Zaouiet Sousse', 'Zarat', 'Zarzis', 'Zriba-Village']
;

  return (
    <div >
      <input type="text" list="custom-options" className="form-control bg-dark text-light"/>
      <CostumCityDropDown options={customOptions} />
    </div>
  );
};

export default CityDropdown;
