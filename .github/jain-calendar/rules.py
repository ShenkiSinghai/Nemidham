import datetime as dt
C, V, J, A, S, B, Asw, K, Mg, Pu, Mh, F = range(12)
def P(pm, pk, tn, id, hi, en, typ="parv", days=1): return {"pm": pm, "paksha": pk, "tn": tn, "id": id, "hi": hi, "en": en, "type": typ, "days": days}
PARV = [
 P(C,"S",1,"vikram-samvat","विक्रम संवत प्रारंभ","Vikram Samvat begins"),
 P(C,"S",5,"dashlakshan-chaitra","दशलक्षण व्रत (चैत्र)","Dashlakshan Vrat (Chaitra)","vrat",10),
 P(C,"S",13,"mahavir-jayanti","महावीर जयंती","Mahavir Jayanti"),
 P(C,"S",13,"ratnatray-chaitra","रत्नत्रय व्रत (चैत्र)","Ratnatray Vrat (Chaitra)","vrat",3),
 P(V,"S",3,"akshay-tritiya","अक्षय तृतीया","Akshay Tritiya"),
 P(J,"S",5,"shrut-panchami","श्रुत पंचमी","Shrut Panchami"),
 P(A,"S",8,"ashtahnika-ashadh","अष्टाह्निका पर्व (आषाढ़)","Ashtahnika Parv (Ashadh)","parv",8),
 P(A,"S",14,"chaturmas-sthapna","चातुर्मास स्थापना","Chaturmas begins"),
 P(A,"S",15,"guru-purnima","गुरु पूर्णिमा","Guru Purnima"),
 P(S,"K",1,"vir-shasan-jayanti","वीर शासन जयंती","Vir Shasan Jayanti"),
 P(S,"S",7,"mukut-saptami","मुकुट सप्तमी (मोक्ष सप्तमी)","Mukut Saptami"),
 P(S,"S",15,"raksha-bandhan","रक्षाबंधन पर्व","Raksha Bandhan"),
 P(B,"K",1,"solahkaran","षोडशकारण व्रत","Solahkaran Vrat","vrat",32),
 P(B,"S",3,"rot-teej","रोट तीज","Rot Teej","vrat"),
 P(B,"S",5,"dashlakshan","दशलक्षण महापर्व","Dashlakshan Mahaparv","parv",10),
 P(B,"S",10,"sugandh-dashami","सुगंध दशमी (धूप दशमी)","Sugandh Dashami"),
 P(B,"S",13,"ratnatray","रत्नत्रय व्रत","Ratnatray Vrat","vrat",3),
 P(B,"S",14,"anant-chaturdashi","अनंत चतुर्दशी","Anant Chaturdashi"),
 P(Asw,"K",1,"kshamavani","क्षमावाणी पर्व","Kshamavani Parv"),
 P(K,"K",13,"dhanya-teras","धन्य तेरस (योग निरोध)","Dhanya Teras (Yog Nirodh)"),
 P(K,"K",15,"deepavali","दीपावली (भगवान महावीर निर्वाणोत्सव)","Deepavali (Bhagwan Mahavir Nirvan)"),
 P(K,"S",1,"vir-nirvan-samvat","वीर निर्वाण संवत प्रारंभ","Vir Nirvan Samvat begins"),
 P(K,"S",8,"ashtahnika-kartik","अष्टाह्निका पर्व (कार्तिक)","Ashtahnika Parv (Kartik)","parv",8),
 P(Mh,"S",5,"dashlakshan-magh","दशलक्षण व्रत (माघ)","Dashlakshan Vrat (Magh)","vrat",10),
 P(Mh,"S",13,"ratnatray-magh","रत्नत्रय व्रत (माघ)","Ratnatray Vrat (Magh)","vrat",3),
 P(F,"S",8,"ashtahnika-phalgun","अष्टाह्निका पर्व (फाल्गुन)","Ashtahnika Parv (Phalgun)","parv",8),
]
TIR = {"rishabh":("ऋषभदेव (आदिनाथ)","Rishabhdev (Adinath)"),"ajit":("अजितनाथ","Ajitnath"),"sambhav":("संभवनाथ","Sambhavnath"),"abhinandan":("अभिनंदननाथ","Abhinandannath"),
 "sumati":("सुमतिनाथ","Sumatinath"),"padmaprabh":("पद्मप्रभ","Padmaprabh"),"suparshva":("सुपार्श्वनाथ","Suparshvanath"),"chandraprabh":("चंद्रप्रभ","Chandraprabh"),
 "pushpadant":("पुष्पदंत","Pushpadant"),"sheetal":("शीतलनाथ","Sheetalnath"),"shreyans":("श्रेयांसनाथ","Shreyansnath"),"vasupujya":("वासुपूज्य","Vasupujya"),
 "vimal":("विमलनाथ","Vimalnath"),"anant":("अनंतनाथ","Anantnath"),"dharm":("धर्मनाथ","Dharmnath"),"shanti":("शांतिनाथ","Shantinath"),"kunthu":("कुंथुनाथ","Kunthunath"),
 "arah":("अरहनाथ","Arahnath"),"malli":("मल्लिनाथ","Mallinath"),"munisuvrat":("मुनिसुव्रतनाथ","Munisuvratnath"),"nami":("नमिनाथ","Naminath"),"nemi":("नेमिनाथ","Neminath"),
 "parshva":("पार्श्वनाथ","Parshvanath"),"mahavir":("महावीर स्वामी","Mahavir Swami")}
ORDER = list(TIR)

