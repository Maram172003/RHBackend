

export const NATIONALITIES = [
  'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguan or Barbudan',
  'Argentine', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini',
  'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese',
  'Bolivian', 'Bosnian or Herzegovinian', 'Botswanan', 'Brazilian', 'Bruneian', 'Bulgarian',
  'Burkinabe', 'Burmese', 'Burundian', 'Cabo Verdean', 'Cambodian', 'Cameroonian', 'Canadian',
  'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comorian', 'Congolese (Congo-Brazzaville)',
  'Congolese (Congo-Kinshasa)', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech',
  'Danish', 'Djiboutian', 'Dominican', 'Dutch', 'East Timorese', 'Ecuadorean', 'Egyptian',
  'Emirati', 'English', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Eswatini', 'Ethiopian',
  'Fijian', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian',
  'Greek', 'Grenadian', 'Guatemalan', 'Guinean', 'Bissau-Guinean', 'Guyanese', 'Haitian',
  'Honduran', 'Hungarian', 'Icelandic', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish',
  'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakh', 'Kenyan',
  'Kiribati', 'Korean (North)', 'Korean (South)', 'Kosovar', 'Kuwaiti', 'Kyrgyz',
  'Lao', 'Latvian', 'Lebanese', 'Lesotho', 'Liberian', 'Libyan', 'Liechtenstein', 'Lithuanian',
  'Luxembourgish', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivian', 'Malian', 'Maltese',
  'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan',
  'Mongolian', 'Montenegrin', 'Moroccan', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese',
  'New Zealander', 'Nicaraguan', 'Nigerien', 'Nigerian', 'North Macedonian', 'Norwegian',
  'Omani', 'Pakistani', 'Palestinian', 'Panamanian', 'Papua New Guinean', 'Paraguayan',
  'Peruvian', 'Philippine', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian',
  'Rwandan', 'Saint Kitts and Nevisian', 'Saint Lucian', 'Saint Vincentian', 'Samoan',
  'San Marinese', 'Sao Tomean', 'Saudi Arabian', 'Scottish', 'Senegalese', 'Serbian',
  'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovak', 'Slovenian', 'Solomon Islander',
  'Somali', 'South African', 'South Sudanese', 'Spanish', 'Sri Lankan', 'Sudanese',
  'Surinamese', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian',
  'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish',
  'Turkmen', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbek', 'Vanuatuan',
  'Vatican', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemeni', 'Zambian', 'Zimbabwean'
] as const;

export type Nationality = typeof NATIONALITIES[number];
