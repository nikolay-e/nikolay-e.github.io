#include <iostream>// difference between <> and "" ?, why there is no .h?
#include <memory>
#include <vector>

template <typename T>
class MyElement; 

template <typename T>
class MyContainer {
public:
	MyContainer() : m_length(0), m_head(nullptr) {}; // default constructor
	
	MyContainer(const std::vector<T>& vec) : m_length(0), m_head(nullptr) {  // parametrized constructor
		
		for (const auto& v : vec) add(v);
	
	};

	MyContainer(const MyContainer& mc) : m_head(mc.m_head), m_length(mc.m_length) { }; // copy constructor

//	conversion constructor ???
	
	~MyContainer() {};

//	MyContainer(Mycontainer&& mc) { }; // move constructor, desn't compile for some reason

	void add(const T& data) {

		if (m_length == 0) {
			m_head = std::make_shared<MyElement<T>>(data);	
		} else {
			std::shared_ptr<MyElement<T>> it = m_head;
			while(it->m_next) it = it->m_next;
			it->m_next = std::make_shared<MyElement<T>>(data);
		}

		m_length++;

	};

	void remove(size_t position) {

		if (position == 0) {
			m_head = m_head->m_next;
		} else if (0 < position && position < m_length ) {
			
			std::shared_ptr<MyElement<T>> it = m_head;
			std::shared_ptr<MyElement<T>> prev = m_head;

			for (size_t i = 0; i < position; i++) {
				prev = it;
				it = it->m_next;
			}

			prev->m_next = it->m_next;

		} else throw std::invalid_argument("Wrong index!");
	}
	
	T get(size_t position) {
		if (0 <= position && position < m_length ) {

			std::shared_ptr<MyElement<T>> it = m_head;

			for (size_t i = 0; i < position; i++) it = it->m_next;
			
			return it->m_data;

		} else throw std::invalid_argument("Wrong index!");
		
	};

	MyContainer& operator= (MyContainer& mc) {
		this.head = mc.head;
		return *this;	
	};

	MyContainer& operator= (MyContainer&& mc) {
		this.m_head = mc.head;
		mc.m_head = nullptr;
		return *this;
	};
 
	friend std::ostream& operator<< (std::ostream& stream, const MyContainer& mc) {
		
		std::shared_ptr<MyElement<T>> it = mc.m_head;
	
		stream << "[";

		if (it) {
			stream << *it;
			it = MyContainer::getNextElement(it);
		}
			
		while(it) {
			stream << ", " << *it; 	
			it = MyContainer::getNextElement(it);
		}

		stream << "]";

		return stream;
	};

private:
	size_t m_length;
	
	std::shared_ptr<MyElement<T>> m_head; 
	
	static std::shared_ptr<MyElement<T>> getNextElement (std::shared_ptr<MyElement<T>> prev) {

		return prev->m_next;
	
	}	
};

template <typename T>
class MyElement {
public:
	MyElement(const T& data) : m_data(data), m_next(nullptr) {};
	
	friend std::ostream& operator<< (std::ostream& stream, const MyElement& mc) {

		stream << mc.m_data;
		return stream;	

	}

private:
	std::shared_ptr<MyElement<T>>  m_next;
	
	T m_data;
	
	friend class MyContainer<T>; 
};


int main() {
	
	MyContainer<int> mc1(std::vector<int>{{1,2,3,4,5,6,7,8,9,10}});

	MyContainer<int> mc2(mc1);

	std::cout << mc1.get(0) << " " << mc1.get(5) << std::endl;

	mc1.remove(0);
	mc1.remove(6);

	std::cout << mc1 << std::endl;
	
	std::cout << mc2 << std::endl;

	return 0;
}
