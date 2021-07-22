#include <iostream>
#include <memory>
#include <vector>

// Quotation marks are used to specify relative header location to the current
// file.
// TODO: OR to the include folders that we pass to the compiler with -I
// option??? "iostream.h" this is the C way to include headers from standard
// libs. <iostream> this is the C++ way to include standard headers.
// TODO: .hpp vs .h what has that to do with templates?

template <typename T>
class MyElement; // This is a forward declaration.

// TODO: Discuss forward declaration.
// TODO: Is there a way to define template class without forward declaration.

template <typename T>
class MyContainer
{
public:
    // This is a default constructor.
    MyContainer() : m_length(0), m_head(nullptr){};

    // TODO: what are the benefits of the initialization list? What is the order
    // of initialization in it?
    // TODO: why it matters in which order the fields defined in the header?

    // This is a parametrized constructor
    MyContainer(const std::vector<T> &vec) : m_length(0), m_head(nullptr)
    {
        for (const auto &v : vec)
            add(v);
    }

    // Converting constructor is a constructor that is not declared explicit (in <
    // C++11 also taking single parameter)

    // This is a copy constructor.
    MyContainer(const MyContainer &mc)
        : m_head(mc.m_head), m_length(mc.m_length) {}

    // TODO: what is explicit? Discuss default, explicit and other keywords
    // aplicable to constructors

    // This is a move constructor, we have to set every field to null, to avoid double deletion
    // TODO: Why double deletion might happen? give an example
    MyContainer(MyContainer &&mc)
        : m_head(std::move(mc.m_head)), m_length(mc.m_length)
    {
        mc.m_head = nullptr;
        mc.m_length = 0;
    }

    ~MyContainer() {}

    class MyIterator
    {
    public:
        MyIterator(MyElement<T> *it) : m_it(it){};
        MyElement<T> *m_it;
        MyIterator operator++() { return this->m_it = this->m_it->m_next; }

        bool operator!=(const MyIterator &mi) { return this->m_it != mi.m_it; }

        T operator*() { return this->m_it->m_data; }
    };

    MyIterator begin() { return m_head; }

    MyIterator end() { return nullptr; }

    void add(const T &data)
    {
        if (m_length == 0)
        {
            m_head = new MyElement<T>(data);
        }
        else
        {
            MyElement<T> *it = m_head;
            while (it->m_next)
                it = it->m_next;
            it->m_next = new MyElement<T>(data);
        }
        m_length++;
    }

    void remove(size_t position)
    {
        if (position == 0 && m_length > 0)
        {
            m_head = m_head->m_next;
        }
        else if (0 < position && position < m_length)
        {
            MyElement<T> *it = m_head;
            MyElement<T> *prev = m_head;
            for (size_t i = 0; i < position; i++)
            {
                prev = it;
                it = it->m_next;
            }
            delete prev->m_next;
            prev->m_next = it->m_next;
        }
        else
            throw std::invalid_argument("Wrong index!");
        m_length--;
    }

    T get(size_t position)
    {
        if (position >= 0 && position < m_length)
        {

            MyElement<T> *it = m_head;

            for (size_t i = 0; i < position; i++)
                it = it->m_next;

            return it->m_data;
        }
        else
            throw std::invalid_argument("Wrong index!");
    }

    MyContainer &operator=(MyContainer &mc)
    {
        this.m_head = mc.m_head;
        this.m_length = mc.m_length;
        return *this;
    }

    MyContainer &operator=(MyContainer &&mc)
    {
        this.m_head = std::move(mc.m_head);
        this.m_length = mc.m_length;
        mc.m_head = nullptr;
        mc.m_length = 0;
        return *this;
    }

    // what is the difference between difining the << inside the class and setting
    // it a friend, and defining it ouside the class
    friend std::ostream &operator<<(std::ostream &stream, const MyContainer &mc)
    {
        MyElement<T> *it = mc.m_head;

        // I remember there was more beautiful way to put everything in the stream
        stream << "[";

        if (it)
        {
            stream << *it;
            it = MyContainer::getNextElement(it);
        }

        while (it)
        {
            stream << ", " << *it;
            it = MyContainer::getNextElement(it);
        }

        stream << "]";

        return stream;
    }

private:
    size_t m_length;
    MyElement<T> *m_head;
    static MyElement<T> *getNextElement(MyElement<T> *prev)
    {
        return prev->m_next;
    }
};

template <typename T>
class MyElement
{
public:
    MyElement(const T &data) : m_data(data), m_next(nullptr){};

    friend std::ostream &operator<<(std::ostream &stream, const MyElement &mc)
    {
        stream << mc.m_data;
        return stream;
    }

private:
    MyElement<T> *m_next;
    T m_data;
    friend class MyContainer<T>;
};

int main()
{
    MyContainer<int> mc1(std::vector<int>{{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}});
    MyContainer<int> mc2(mc1);

    std::cout << mc1.get(0) << " " << mc1.get(5) << std::endl;

    mc1.remove(0);
    mc1.remove(6);

    for (auto k : mc1)
    {
        std::cout << k << " ";
    }

    std::cout << std::endl;
    std::cout << mc1 << std::endl;
    std::cout << mc2 << std::endl;

    return 0;
}
