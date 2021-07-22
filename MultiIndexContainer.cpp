#include <iostream>
#include <string>
#include <string_view>

#include <boost/format.hpp>

#include <boost/multi_index_container.hpp>
#include <boost/multi_index/member.hpp>
#include <boost/multi_index/mem_fun.hpp>
#include <boost/multi_index/ranked_index.hpp>
#include <boost/multi_index/ordered_index.hpp>
#include <boost/multi_index/sequenced_index.hpp>

class Person;
std::ostream &operator<<(std::ostream &os, const Person &p);

class Person
{
    std::string name;
    std::string surname;
    std::string id;

public:
    Person() {}
    Person(std::string &&_name, std::string &&_surname, std::string &&_id) : name{std::move(_name)},
                                                                             surname{std::move(_surname)}, id{std::move(_id)} {}
    Person(std::string_view _name, std::string_view _surname, std::string_view _id) : name{_name}, surname{_surname}, id{_id} {}
    const std::string &getNom() const { return name; }
    const std::string &getNaissance() const { return surname; }
    const std::string &getid() const { return id; }

    struct SetNom : public std::unary_function<Person, void>
    {
        std::string _name;
        SetNom(std::string __name) : _name{std::move(__name)} {}
        void operator()(Person &p)
        {
            p.name = std::move(_name);
        }
    };

    struct Setid : public std::unary_function<Person, void>
    {
        std::string _id;
        Setid(std::string __id) : _id{std::move(__id)} {}
        void operator()(Person &p)
        {
            p.id = std::move(_id);
        }
    };

    struct RollBack : public std::unary_function<Person, void>
    {
        std::string _id;
        RollBack(std::string __id) : _id{std::move(__id)} {}
        void operator()(Person &p)
        {
            std::cout << "RollBack::" << __FUNCTION__ << p << std::endl;
            p.id = std::move(_id);
        }
    };

    auto operator<=>(const Person &) const = default;

    // The two below are used as tags for indexing types
    struct BySeq
    {
    };
    struct Byid
    {
    };
};

std::ostream &operator<<(std::ostream &os, const Person &p)
{
    return os << boost::format(R"olo({name: "%s", surname: "%s", id: "%s"})olo") % p.getNom() % p.getNaissance() % p.getid();
}

template <typename T>
std::ostream &operator<<(std::ostream &os, const std::pair<T, bool> &p)
{
    return os << boost::format(R"olo({first: %1%, second: %2$b})olo") % *p.first % p.second;
}

namespace bmi = boost::multi_index;
namespace bl = boost::lambda;

// Ordered indices sort the elements on the key and provide fast lookup capabilites. ordered_unique, ordered_non_unique
// Hashed indices offer high efficiency access through hashing techniques. hashed_unique, hashed_non_unique
// Sequenced indices allow to arrange elements as in a bidirectional list. sequenced
// Random access indices provide constant time positional access and free ordering of elements. random_access

uidg PersonMulti = bmi::multi_index_container<
    Person,
    bmi::indexed_by<
        bmi::sequenced<bmi::tag<Person::BySeq>>,
        bmi::ordered_unique<
            bmi::tag<Person::Byid>,
            bmi::const_mem_fun<Person, const std::string &, &Person::getid>,
            std::greater<std::string>>>>;

int main()
{
    PersonMulti pm;
    std::cout << "insert:" << std::endl;
    std::cout << pm.emplace_back(std::string_view("1234"), "2", "3") << std::endl;
    std::cout << pm.emplace_back(std::string_view("1234567"), "2", "3") << std::endl;
    std::cout << pm.emplace_back(std::string_view("1234"), "2", "34") << std::endl;

    std::cout << "---------------------\nlist:" << std::endl;
    for (const auto &el : pm)
    {
        std::cout << el << std::endl;
    }

    std::cout << "---------------------\nfind:" << std::endl;
    PersonMulti::index<Person::Byid>::type &pid = pm.get<Person::Byid>();
    pid.modify(pid.find("3"), Person::SetNom("Peter"));
    for (const auto &el : pid)
    {
        std::cout << el << std::endl;
    }

    std::cout << "---------------------\nSetid:" << std::endl;
    pid.modify(pid.find("3"), Person::Setid("34"), Person::RollBack("125"));
    for (const auto &el : pid)
    {
        std::cout << el << std::endl;
    }

    std::cout << "---------------------\nproject:" << std::endl;
    PersonMulti::nth_index<0>::type &ps = pm.get<Person::BySeq>();
    PersonMulti::index<Person::Byid>::type::iterator pid_it34 = pid.find("34");
    PersonMulti::index<Person::BySeq>::type::iterator pseq_it34 = pm.project<Person::BySeq>(pid_it34);
    std::cout << *pseq_it34 << std::endl;
    return 0;
}
