import { useState, useCallback, FormEvent, useEffect, useRef } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import clsx from 'clsx';
import {
	defaultArticleState,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	ArticleStateType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	stateArticle: ArticleStateType;
	setStateArticle: (data: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	setStateArticle,
	stateArticle,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedStateAricle, setSelectedStateArticle] =
		useState<ArticleStateType>(stateArticle);
	const formRef = useRef<HTMLFormElement>(null);

	const toggleForm = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	const handleSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setStateArticle(selectedStateAricle);
			setIsOpen(false);
		},
		[selectedStateAricle, setStateArticle]
	);

	const handleReset = useCallback(() => {
		setSelectedStateArticle(defaultArticleState);
		setStateArticle(defaultArticleState);
	}, [setStateArticle]);

	const handleChange =
		(field: keyof ArticleStateType) =>
		(option: (typeof selectedStateAricle)[keyof ArticleStateType]) => {
			setSelectedStateArticle((prev) => ({
				...prev,
				[field]: option,
			}));
		};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (
				!formRef.current?.contains(target) &&
				!target.closest(
					'[aria-label="Открыть/Закрыть форму параметров статьи"]'
				)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('pointerdown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('pointerdown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={toggleForm} />
			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					ref={formRef}
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase align='center'>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						selected={selectedStateAricle.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleChange('fontFamilyOption')}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='fontSizeOption'
						selected={selectedStateAricle.fontSizeOption}
						options={fontSizeOptions}
						onChange={handleChange('fontSizeOption')}
					/>
					<Select
						title='Цвет шрифта'
						selected={selectedStateAricle.fontColor}
						options={fontColors}
						onChange={handleChange('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						selected={selectedStateAricle.backgroundColor}
						options={backgroundColors}
						onChange={handleChange('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						selected={selectedStateAricle.contentWidth}
						options={contentWidthArr}
						onChange={handleChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='clear' htmlType='reset' />
						<Button title='Применить' type='apply' htmlType='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
