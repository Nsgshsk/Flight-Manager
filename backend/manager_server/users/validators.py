from datetime import datetime

egn_regions = {
    # https://www.iso.org/obp/ui/#iso:code:3166:BG
    43: {'bg': 'Благоевград', 'en': 'Blagoevgrad', 'start': 0, 'iso': 'BG-01'},  # 000 - 043
    93: {'bg': 'Бургас', 'en': 'Burgas', 'start': 44, 'iso': 'BG-02'},  # 044 - 093
    139: {'bg': 'Варна', 'en': 'Varna', 'start': 94, 'iso': 'BG-03'},  # 094 - 139
    169: {'bg': 'Велико Търново', 'en': 'Veliko Turnovo', 'start': 140, 'iso': 'BG-04'},  # 140 - 169
    183: {'bg': 'Видин', 'en': 'Vidin', 'start': 170, 'iso': 'BG-05'},  # 170 - 183
    217: {'bg': 'Враца', 'en': 'Vratza', 'start': 184, 'iso': 'BG-06'},  # 184 - 217
    233: {'bg': 'Габрово', 'en': 'Gabrovo', 'start': 218, 'iso': 'BG-07'},  # 218 - 233
    281: {'bg': 'Кърджали', 'en': 'Kurdzhali', 'start': 234, 'iso': 'BG-09'},  # 234 - 281
    301: {'bg': 'Кюстендил', 'en': 'Kyustendil', 'start': 282, 'iso': 'BG-10'},  # 282 - 301
    319: {'bg': 'Ловеч', 'en': 'Lovech', 'start': 302, 'iso': 'BG-11'},  # 302 - 319
    341: {'bg': 'Монтана', 'en': 'Montana', 'start': 320, 'iso': 'BG-12'},  # 320 - 341
    377: {'bg': 'Пазарджик', 'en': 'Pazardzhik', 'start': 342, 'iso': 'BG-13'},  # 342 - 377
    395: {'bg': 'Перник', 'en': 'Pernik', 'start': 378, 'iso': 'BG-14'},  # 378 - 395
    435: {'bg': 'Плевен', 'en': 'Pleven', 'start': 396, 'iso': 'BG-15'},  # 396 - 435
    501: {'bg': 'Пловдив', 'en': 'Plovdiv', 'start': 436, 'iso': 'BG-16'},  # 436 - 501
    527: {'bg': 'Разград', 'en': 'Razgrad', 'start': 502, 'iso': 'BG-17'},  # 502 - 527
    555: {'bg': 'Русе', 'en': 'Ruse', 'start': 528, 'iso': 'BG-18'},  # 528 - 555
    575: {'bg': 'Силистра', 'en': 'Silistra', 'start': 556, 'iso': 'BG-19'},  # 556 - 575
    601: {'bg': 'Сливен', 'en': 'Sliven', 'start': 576, 'iso': 'BG-20'},  # 576 - 601
    623: {'bg': 'Смолян', 'en': 'Smolyan', 'start': 602, 'iso': 'BG-21'},  # 602 - 623
    721: {'bg': 'София', 'en': 'Sofia', 'start': 624, 'iso': 'BG-22'},  # 624 - 721
    751: {'bg': 'София (окръг)', 'en': 'Sofia (county)', 'start': 722, 'iso': 'BG-23'},  # 722 - 751
    789: {'bg': 'Стара Загора', 'en': 'Stara Zagora', 'start': 752, 'iso': 'BG-24'},  # 752 - 789
    821: {'bg': 'Добрич', 'en': 'Dobrich', 'start': 790, 'iso': 'BG-08'},  # 790 - 821
    843: {'bg': 'Търговище', 'en': 'Targovishte', 'start': 822, 'iso': 'BG-25'},  # 822 - 843
    871: {'bg': 'Хасково', 'en': 'Haskovo', 'start': 844, 'iso': 'BG-26'},  # 844 - 871
    903: {'bg': 'Шумен', 'en': 'Shumen', 'start': 872, 'iso': 'BG-27'},  # 872 - 903
    925: {'bg': 'Ямбол', 'en': 'Yambol', 'start': 904, 'iso': 'BG-28'},  # 904 - 925
    999: {'bg': 'Друг', 'en': 'Other', 'start': 926, 'iso': 'BG-XX'},  # 926 - 999
    }

class EgnValidator:
    @classmethod
    def get_date(cls, egn):
        '''
            Get the date information from the EGN
            Return hash with year, month, day and datetime.
        '''
        try:
            year, month, day = int(egn[0:2]), int(egn[2:4]), int(egn[4:6])
        except Exception:
            return False
        if month >= 40:
            month -= 40
            year += 2000
        elif month >= 20:
            month -= 20
            year += 1800
        else:
            year += 1900
        try:

            dt = datetime.strptime('%s-%s-%s' % (year, month, day), "%Y-%m-%d")
            return {'year': year, 'month': month, 'day': day, 'datetime': dt}

        except ValueError:
            return False
    
    @classmethod
    def validate_egn(cls, egn):
        '''
        Check Bulgarian EGN codes for validity
        full information about algoritm is available here
        http://www.grao.bg/esgraon.html#section2
        https://gist.github.com/vstoykov/1137057
        '''
        if isinstance(egn, int):
            egn = str('{0:0=10d}'.format(egn))

        def check_valid_code(egn):
            egn_weights = (2, 4, 8, 5, 10, 9, 7, 3, 6)
            try:
                my_sum = sum([weight * int(digit) for weight,
                            digit in zip(egn_weights, egn)])
                return int(egn[-1]) == my_sum % 11 % 10
            except ValueError:
                return False

        def check_greg_adopt(egn_date):
            # Gregorian calendar adoption: 31/03/1916 > +13 days > 14/04/1916
            if (
                egn_date['year'] == 1916 and
                egn_date['month'] == 4 and
                egn_date['day'] <= 13
                ):
                return False
            return True

        egn_date = cls.get_date(egn)

        return (len(egn) == 10 and
                check_valid_code(egn) and
                isinstance(egn_date, dict) and
                check_greg_adopt(egn_date))