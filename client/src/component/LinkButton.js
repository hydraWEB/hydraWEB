import Link from 'next/link'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useEffect, useState} from 'react'
import {css, jsx} from '@emotion/react'
import styled from '@emotion/styled'

export default function LinkButton({
                                       children,
                                       isLightOn,
                                       className,
                                       onClick,
                                       link,
                                       text,
                                       icon,

                                       textColor,
                                       iconColor,
                                       backgroundColor,
                                       textHoverColor,
                                       iconHoverColor,
                                       backgroundHoverColor,
                                       textActiveColor,
                                       iconActiveColor,
                                       backgroundActiveColor,

                                       textLightColor,
                                       iconLightColor,
                                       backgroundLightColor,
                                       textLightHoverColor,
                                       iconLightHoverColor,
                                       backgroundLightHoverColor,
                                       textLightActiveColor,
                                       iconLightActiveColor,
                                       backgroundLightActiveColor,
                                   }) {

    const ButtonText = styled.p(
        props => (
            {

            }
        ))

    const IconWrapper = styled.div(
        props => (
            {
                marginRight: text ? "10px" : "0px",
                width: '18px',
            }
        ))

    const buttonStyle = props => ({
        marginTop: "3px",
        marginBottom: "3px",
        position: "relative",
        borderRadius: "4px",
        display: "flex",
        height: "42px",
        flexDirection: "row",
        alignItems: 'center',
        outline: 'none',
        padding: '8px 14px 8px 14px',
    })


    const ButtonWrapper = styled.div(
        props => (
            {
                display: 'inline-block'
            }
        )
    )


    const Button = styled.button(
        buttonStyle,
        props => (
            !isLightOn && {
                backgroundColor: backgroundColor ? backgroundColor : "transparent",
                [ButtonText]: {
                    color: textColor ? textColor : "#AAAAAA"
                },
                [IconWrapper]: {
                    color: iconColor ? iconColor : "white"
                },
                '&:hover': {
                    backgroundColor: backgroundHoverColor ? backgroundHoverColor : "#92a4e454",
                    outline: 'none',
                    [ButtonText]: {
                        color: textHoverColor ? textHoverColor : "#92a4e4",
                    },
                    [IconWrapper]: {
                        color: iconHoverColor ? iconHoverColor : "#92a4e4",
                    }
                },
                '&:active': {
                    backgroundColor: backgroundActiveColor ? backgroundActiveColor : "#92a4e454",
                    outline: 'none',
                    [ButtonText]: {
                        color: textActiveColor ? textActiveColor : "#92a4e4",
                    },
                    [IconWrapper]: {
                        color: iconActiveColor ? iconActiveColor : "#92a4e4",
                    }
                }
            }

            || isLightOn && {
                backgroundColor: backgroundLightColor ? backgroundLightColor : "#92a4e454",
                [ButtonText]: {
                    color: textLightColor ? textLightColor : "#92a4e4"
                },
                [IconWrapper]: {
                    color: iconLightColor ? iconLightColor : "#92a4e4"
                },
                '&:hover': {
                    backgroundColor: backgroundLightHoverColor ? backgroundLightHoverColor : "#92a4e454",
                    outline: 'none',
                    [ButtonText]: {
                        color: textLightHoverColor ? textLightHoverColor : "#92a4e4",
                    },
                    [IconWrapper]: {
                        color: iconLightHoverColor ? iconLightHoverColor : "#92a4e4",
                    }
                },
                '&:active': {
                    backgroundColor: backgroundLightActiveColor ? backgroundLightActiveColor : "#92a4e454",
                    outline: 'none',
                    [ButtonText]: {
                        color: textLightActiveColor ? textLightActiveColor : "#92a4e4",
                    },
                    [IconWrapper]: {
                        color: iconLightActiveColor ? iconLightActiveColor : "#92a4e4",
                    }
                }
            }


        ))

    return (
        <>
            <div className={className}>
                <ButtonWrapper>
                    {link != null &&
                    <Link href={link}>
                        <a>
                            <Button onClick={onClick}>
                                {icon &&
                                <IconWrapper>
                                    <FontAwesomeIcon
                                        icon={icon}
                                    />
                                </IconWrapper>
                                }
                                { text &&
                                <ButtonText>{text}</ButtonText>
                                }
                            </Button>
                        </a>
                    </Link>
                    }
                </ButtonWrapper>
            </div>
        </>
    )
}