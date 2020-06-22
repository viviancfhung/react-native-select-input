import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import {Picker as RNPicker} from '@react-native-community/picker';
import SlideUpAnimation from './SlideUpAnimation';
import PickerHeader from './PickerHeader';

class Picker extends Component {
  static propTypes = {
    done: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        label: PropTypes.string,
      }),
    ).isRequired,
    onChange: PropTypes.func,
    toggleShowOptions: PropTypes.func.isRequired,
    doneStyle: PickerHeader.propTypes.doneStyle,
    testProperty: PropTypes.string,
  };

  static defaultProps = {
    visible: false,
    value: null,
    onChange: () => {},
    doneStyle: PickerHeader.defaultProps.doneStyle,
    testProperty: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      showPicker: false,
    };

    this.styles = styles(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      this.handleTogglePicker(nextProps);
    }
  }

  handleTogglePicker = ({ visible }) => {
    if (visible) {
      return setTimeout(() => this.setState({ showPicker: true }), 150);
    }

    return this.setState({ showPicker: false });
  };

  renderPicker = () => (
    <RNPicker
      selectedValue={this.props.value}
      onValueChange={this.props.onChange}
      style={this.styles.pickerContainer}
    >
      {this.props.options.map(option => (
        <RNPicker.Item
          key={option.value}
          value={option.value}
          label={option.label}
        />
      ))}
    </RNPicker>
  );

  render() {
    const { showPicker } = this.state;
    const {
      visible,
      done,
      toggleShowOptions,
      doneStyle,
      testProperty,
    } = this.props;

    if (Platform.OS === 'android') {
      return this.renderPicker();
    }

    return (
      <Modal
        animationType="fade"
        visible={visible}
        transparent
        onRequestClose={toggleShowOptions}
      >
        <TouchableWithoutFeedback onPress={toggleShowOptions} accessible={false}>
          <View style={this.styles.pickerCloseAreaContainer}>
            <SlideUpAnimation visible={showPicker}>
              <PickerHeader
                done={done}
                toggleShowOptions={toggleShowOptions}
                doneStyle={doneStyle}
                testProperty={testProperty}
              />

              {this.renderPicker()}
            </SlideUpAnimation>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = ({ colors }) => StyleSheet.create({
  pickerCloseAreaContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    borderColor: 'red',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  pickerContainer: {
    ...Platform.select({
      ios: {
        backgroundColor: colors.light,
        width: '100%',
      },
      android: {
        // Workaround so the picker shows in Android
        // (https://github.com/facebook/react-native/issues/7817#issuecomment-264851951)
        position: 'absolute',
        width: 1000,
        height: 1000,
        zIndex: 0,
      },
    }),
  },
});

export default Picker;
