import { useFonts } from 'expo-font';
import { Link, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
	findNodeHandle,
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	FlatList,
	Alert,
} from 'react-native';

import { Pressable } from 'react-native';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const resultRef = useRef(null);
	const selectDayRef = useRef(null);
	const [sendBtnIsActive, setSendBtnIsActive] = useState(false);
	const [isActive, setIsActive] = useState(null);
	const [isVisible, setIsVisible] = useState(null);
	const [arrValues, setArrValues] = useState([]);
	const [valueGlucose, setValueGlucose] = useState('');
	const [valueComments, setValueComments] = useState('');
	const [timeThisMoment, setTimeThisMoment] = useState('');
	// const [data, setData] = useState(null);

	// Берем дату, а не время
	let date = new Date().toLocaleString().split(',')[0];

	const objDay = {
		day: 'завтрак',
		lunch: 'обед',
		dinner: 'ужин',
	};

	function selectDay(item, index) {
		setTimeThisMoment(item);
		console.log(isActive);
		setIsActive(index);
		console.log(isActive);
	}

	function selectDayField() {
		// console.log(selectDayRef.current.style.marginTop);
		selectDayRef.current.style.marginTop = '0';
	}

	function listElems() {
		return arrValues.map((item, index) => {
			return (
				<>
					<View style={styles.result_metrics}>
						<Text style={styles.dataMetric}>{item['date']}</Text>

						<Text style={styles.result_metric}>
							{item['valueGlucose']} мг/л
						</Text>

						<Text style={styles.result_metric}>{item['timeThisMoment']}</Text>

						<Text style={styles.result_metric}>{item['valueComments']}</Text>
					</View>
				</>
			);
		});
	}

	function testAlert(field) {
		Alert.alert(
			'Внимание! Ошыпка!',
			`У вас ошыпка в поле ${field}. Перезаполните форму, пожалуйста`,
			[
				{
					text: 'Отмена',
				},
				{
					text: 'ОК',
				},
			],
			{ cancelable: true } // Разрешить закрытие окна по нажатию вне его
		);
	}

	function logic() {
		// Значения со всех полей
		if (!valueGlucose || valueGlucose == null || valueGlucose == '') {
			testAlert(valueGlucose);
			return false;
		} else if (
			!timeThisMoment ||
			timeThisMoment == null ||
			timeThisMoment == ''
		) {
			testAlert(timeThisMoment);

			return false;
		}
		arrValues.push({ date, valueGlucose, timeThisMoment, valueComments });
		setValueGlucose('');
		setTimeThisMoment('');
		setValueComments('');
		setIsActive(null);
		setSendBtnIsActive(prev => !prev);
	}

	function seeResult() {
		setIsVisible(value => !value);
	}

	return (
		<View style={styles.wrapper}>
			<Text style={styles.date}>{date}</Text>
			<Text style={styles.headline}>Значение глюкозы (мг/л)</Text>

			<View style={styles.wrapperField}>
				<View
					style={{
						alignItems: 'center',
					}}
				>
					<TextInput
						style={styles.inputGlucosa}
						onChangeText={newText => {
							setValueGlucose(newText);
						}}
						underlineColorAndroid='transparent'
						value={valueGlucose}
					/>
				</View>
			</View>

			<Text onPress={selectDayField} style={styles.headline}>
				Выберите день
			</Text>
			<View style={styles.wrapperField}>
				<View>
					<View style={styles.container}>
						<View style={styles.content} ref={selectDayRef}>
							{Object.values(objDay).map((item, index) => {
								return (
									<Text
										onPress={() => selectDay(item, index)}
										style={[
											styles.valueDay,
											isActive == index && styles.active,
										]}
									>
										{item}
									</Text>
								);
							})}
						</View>
					</View>
				</View>
			</View>

			<Text style={styles.headline}>Комментарий</Text>
			<View style={styles.wrapperField}>
				<View>
					<TextInput
						underlineColorAndroid='transparent'
						onChangeText={setValueComments}
						value={valueComments}
						style={[styles.inputText, { paddingLeft: '5px' }]}
					/>
				</View>
			</View>

			<Pressable onPress={() => logic()} style={[styles.send]}>
				<Text style={styles.sendText}>Отправить</Text>
			</Pressable>

			<Text
				onPress={() => {
					seeResult(isVisible);
				}}
				style={styles.result}
			>
				Для появления общей сводки коснитесь этого поля
			</Text>
			<View ref={resultRef} style={!isVisible ? styles.dNone : styles.dBlock}>
				{listElems()}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		height: '100vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		backgroundColor: '#9CC2FF',
	},

	wrapperField: {
		height: '65px',

		backgroundColor: 'rgba(50, 50, 50, .6)',

		borderRadius: '10px',
	},

	container: {
		overflowY: 'hidden',
		// height: '100px',

		opacity: '.5s',
	},

	content: {
		height: '60px',
		width: '300px',

		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-evenly',

		marginTop: '-60px',
	},

	valueDay: {
		width: '90px',

		padding: '12px',
		marginTop: '5px',

		textAlign: 'center',
		fontSize: '17px',

		backgroundColor: '#AC94E4',
		borderRadius: '7px',
	},

	dBlock: {
		display: 'block',
	},
	dNone: {
		display: 'None',
	},

	date: {
		fontSize: '40px',
	},

	inputGlucosa: {
		height: '65px',
		width: '60px',

		textAlign: 'center',
		fontSize: '20px',
		fontWeight: '700',
		color: '#fff',

		borderBottomWidth: '2px',
		borderBottomColor: '#34D2AF',
		borderBottomRightRadius: '6px',
		borderBottomLeftRadius: '6px',
	},

	inputText: {
		width: '250px',
		height: '65px',

		color: '#fff',

		borderBottomWidth: '2px',
		borderBottomColor: '#34D2AF',
		borderBottomRightRadius: '6px',
		borderBottomLeftRadius: '6px',
	},

	headline: {
		fontSize: '16px',
		fontWeight: 600,

		padding: '5px',
		marginTop: '15px',

		backgroundColor: '#fff',
		borderRadius: '6px',
	},

	middleDiv: {},

	send: {
		backgroundColor: '#fff',
		padding: '8px',
		marginTop: '15px',

		borderRadius: '5px',
	},

	sendText: {
		fontSize: '17px',
		fontWeight: '700',
	},

	result: {
		width: '300px',

		padding: '9px',
		marginTop: '10px',
		marginBottom: '10px',

		textAlign: 'center',
		fontSize: '20px',

		backgroundColor: '#35D699',

		borderRadius: '7px',
	},

	result_metrics: {
		flexDirection: 'row',
	},

	dataMetric: {
		width: '80px',
		height: 'auto',

		backgroundColor: '#B2F1FF',

		padding: '5px',

		textAlign: 'center',

		borderRadius: '5px',
	},

	result_metric: {
		width: '80px',

		padding: '5px',
		margin: '3px',

		textAlign: 'center',

		border: '2px solid grey',
		borderRadius: '5px',
	},

	active: {
		backgroundColor: '#FFF',
	},
});
