import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Notnav from '../client/components/Navbar';
// import toJson from 'enzyme-to-json';

// Newer Enzyme versions require an adapter to a particular version of React
configure({ adapter: new Adapter() });

//search div with two components
    //create event and search event

describe('Navbar has two buttons', () => {
    const wrapper = shallow(<Notnav />);

    it('Expect the Navbar to contain two \<a\> tags referencing google and facebook Oauth', () => {
        expect(wrapper.find('a')).get(0).getAttribute('href').toBe('/api/loginFB');
        expect(wrapper.find('a')).get(1).getAttribute('href').toBe('/api/loginG');
    });


});